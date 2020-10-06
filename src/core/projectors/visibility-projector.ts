import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { FleetProjector } from "./fleet-projector";
import { combineLatest, zip, Observable } from "rxjs";
import { WorldProjector } from "./world-projector";
import { map, switchMap, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { worldhasOwner, World } from "../../shared/model/v1/world";
import { Fleet, FleetInTransit, fleetIsAtWorld, pathOfFleetInTransit } from "../../shared/model/v1/fleet";
import { GatesProjector } from "./gates-projector";
import { VisibleWorld, VisibleState, applyFogOfWar } from "../../shared/model/v1/visible-state";
import { type } from "os";
import { PlayerProjector } from "./player-projector";

export type WorldVisibility = 'VISIBLE' | 'FOG_OF_WAR' | 'HIDDEN'

export type VisibilityByWorld = { [worldId: string]: WorldVisibility }

export type VisibilityByPlayerId = { [playerId: string]: VisibilityByWorld }

@injectable()
export class VisibilityProjector {
  constructor(
    private store: ReadonlyStore,
    private worlds: WorldProjector,
    private fleets: FleetProjector,
    private gates: GatesProjector,
    private players: PlayerProjector
  ) { }


  public worldsToRememberFromGlobalRevelationByPlayerId$ = this.worlds.byId$.pipe(
    map(worldsById => {
      const result: { [playerId: string]: string[] } = {}
      for (const world of Object.values(worldsById)) {
        if (worldhasOwner(world)) {
          result[world.ownerId] = result[world.ownerId] ?? [];
          result[world.ownerId].push(world.id)
        }
      }
      return result;
    }),
    map((ownedWorldsByPlayer: { [playerId: string]: string[] }) => {

      const allPlayers = Object.getOwnPropertyNames(ownedWorldsByPlayer);

      const allWorldsToRemember = new Set<string>()

      Object.values(ownedWorldsByPlayer).forEach(values =>
        values.forEach(worldId =>
          allWorldsToRemember.add(worldId)
        )
      )

      const result: { [playerId: string]: string[] } = {}
      allPlayers.forEach((playerId) => {
        result[playerId] = [...allWorldsToRemember].filter(it => !ownedWorldsByPlayer[playerId].includes(it))
      })
      return result;
    })
  )

  public visibleUniverseForPlayer(playerId: string): Observable<VisibleState> {
    return combineLatest([
      this.store.state$,
      this.calculatedVisibleWorldsForPlayer$
    ]).pipe(
      map(([state, visibility]) => {
        const visibilityForPlayer = visibility[playerId];
        const fleets = {
          ...state.universe.fleets
        }

        const worldIsNotVisible = (worldId: string) => {
          return !visibilityForPlayer[worldId]
            || visibilityForPlayer[worldId] === 'FOG_OF_WAR'
        }

        const fleetIsNotVisible = (fleet: FleetInTransit) => {
          const worlds = pathOfFleetInTransit(fleet);
          return worldIsNotVisible(worlds[0]) || worldIsNotVisible(worlds[1])
        }

        Object.values(state.universe.fleets).filter(fleet => fleet.ownerId !== playerId).forEach(fleet => {

          if (!fleetIsAtWorld(fleet) && fleetIsNotVisible(fleet)) {
            delete fleets[fleet.id];
          } else if (fleetIsAtWorld(fleet) && worldIsNotVisible(fleet.currentWorldId)) {
            delete fleets[fleet.id];
          } else if (fleet.ownerId !== playerId) {
            fleets[fleet.id] = {
              ...fleets[fleet.id],
              orders: []
            }
          }
        })
        const worlds: {
          [id: string]: VisibleWorld
        } = {
          ...state.universe.worlds
        }
        Object.values(state.universe.worlds).forEach(world => {
          if (!visibilityForPlayer[world.id]) {
            worlds[world.id] = {
              status: 'UNKNOWN',
              id: world.id
            }
          } else if (visibilityForPlayer[world.id] === 'FOG_OF_WAR') {
            worlds[world.id] = applyFogOfWar(world);
          }
        })

        const result: VisibleState = {
          currentTimestamp: state.currentTimestamp,
          gameEndTimestamp: state.gameEndTimestamp,
          gameStartTimestamp: state.gameStartTimestamp,
          players: state.players,
          universe: {
            worlds,
            fleets,
            gates: state.universe.gates
          }
        }

        return result;
      }),
      shareReplay(1),
    )
  }

  private calculatedVisibleWorldsForPlayer$: Observable<VisibilityByPlayerId> = combineLatest([
    this.worlds.byId$,
    this.fleets.byId$,
    this.gates.all$,
    this.players.allPlayerIds$
  ]).pipe(
    map(([worldsById, fleetsById, gates, allPlayerIds]) => {
      const allFleets = Object.values(fleetsById);
      const result: VisibilityByPlayerId = {};

      function markWorldVisibleForPlayer(visibility: VisibilityByPlayerId, worldId: string, playerId: string) {
        visibility[playerId] = visibility[playerId] ?? {}
        visibility[playerId][worldId] = 'VISIBLE';
        allPlayerIds.filter(it => it !== playerId).forEach(id => {
          visibility[id] = visibility[id] ?? {}
          if (visibility[id][worldId] !== 'HIDDEN') {
            visibility[id][worldId] = 'FOG_OF_WAR'
          }
        })
      }

      function markWorldHiddenForPlayer(visibility: VisibilityByPlayerId, worldId: string, playerId: string) {
        visibility[playerId] = visibility[playerId] ?? {}
        allPlayerIds.forEach(id => {
          visibility[id] = visibility[id] ?? {}
          if (!visibility[id][worldId]) {
            visibility[id][worldId] = 'HIDDEN'
          }
        })
      }

      allPlayerIds.forEach(playerId => {
        Object.values(worldsById).forEach(world => {
          if (this.worldOwnedByPlayer(world, playerId)) {
            markWorldVisibleForPlayer(result, world.id, playerId)
          }
          if (this.playerHasFleetAtWorld(allFleets, playerId, world)) {
            markWorldVisibleForPlayer(result, world.id, playerId)
          }
          const neighboringWorldIds = gates[world.id];
          if (neighboringWorldIds && neighboringWorldIds.some(id => {
            const neighboringWorld = worldsById[id];
            return this.worldOwnedByPlayer(neighboringWorld, playerId) || this.playerHasFleetAtWorld(allFleets, playerId, neighboringWorld)
          })) {
            markWorldVisibleForPlayer(result, world.id, playerId)
          }
          markWorldHiddenForPlayer(result, world.id, playerId)
        })
      })

      return result;
    }),
    shareReplay(1),
  )

  public nextRevealedWorld$ = combineLatest([
    this.calculatedVisibleWorldsForPlayer$,
    this.worlds.byId$
  ]).pipe(
    map(([visibility, worldsById]) => {

      for (const playerId of Object.getOwnPropertyNames(visibility)) {
        for (const worldId of Object.getOwnPropertyNames(worldsById)) {
          const world = worldsById[worldId];
          if (visibility[playerId][worldId] === 'VISIBLE' && !world.worldDiscoveredNotificationSent) {
            return {
              playerId,
              worldId
            }
          }
        }
      }

      return null;
    }),
    shareReplay(1),
  ) as Observable<{ playerId: string, worldId: string } | null>

  private playerHasFleetAtWorld(allFleets: Fleet[], playerId: string, world: World) {
    return allFleets.some(fleet => this.fleetOwnedByPlayer(fleet, playerId) && fleetIsAtWorld(fleet) && fleet.currentWorldId === world.id);
  }

  private worldOwnedByPlayer(world: World, playerId: string) {
    return worldhasOwner(world) && world.ownerId === playerId;
  }

  private fleetOwnedByPlayer(fleet: Fleet, playerId: string) {
    return fleet.ownerId === playerId;
  }
}