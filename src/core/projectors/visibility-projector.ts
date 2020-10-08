import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { FleetProjector } from "./fleet-projector";
import { combineLatest, Observable } from "rxjs";
import { WorldProjector } from "./world-projector";
import { map, shareReplay } from "rxjs/operators";
import { worldHasOwner, World } from "../../shared/model/v1/world";
import { Fleet, FleetInTransit, fleetIsAtWorld, pathOfFleetInTransit } from "../../shared/model/v1/fleet";
import { GatesProjector } from "./gates-projector";
import { VisibleWorld, VisibleState, applyFogOfWar } from "../../shared/model/v1/visible-state";
import { PlayerProjector } from "./player-projector";
import { WorldType } from "../../shared/model/v1/world-type";

export type WorldVisibility = 'VISIBLE' | 'PRESENT' | 'FOG_OF_WAR' | 'HIDDEN'

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
            || ['FOG_OF_WAR', 'HIDDEN'].includes(visibilityForPlayer[worldId])
        }

        const warpingFleetIsNotVisible = (fleet: FleetInTransit) => {
          const worlds = pathOfFleetInTransit(fleet);
          const playerNotPresentAtWorld = (worldId: string) => visibilityForPlayer[worldId] !== 'PRESENT'
          return playerNotPresentAtWorld(worlds[0]) && playerNotPresentAtWorld(worlds[1])
        }

        Object.values(state.universe.fleets).filter(fleet => fleet.ownerId !== playerId).forEach(fleet => {

          if (!fleetIsAtWorld(fleet) && warpingFleetIsNotVisible(fleet)) {
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
          if (!visibilityForPlayer[world.id] || visibilityForPlayer[world.id] === 'HIDDEN') {
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

      function markWorldPresentForPlayer(visibility: VisibilityByPlayerId, worldId: string, playerId: string) {
        visibility[playerId] = visibility[playerId] ?? {}
        visibility[playerId][worldId] = 'PRESENT';
        allPlayerIds.filter(it => it !== playerId).forEach(id => {
          visibility[id] = visibility[id] ?? {}
          if (!visibility[id][worldId] || visibility[id][worldId] === 'HIDDEN') {
            visibility[id][worldId] = 'FOG_OF_WAR'
          }
        })
      }

      function markWorldVisibleForPlayer(visibility: VisibilityByPlayerId, worldId: string, playerId: string, worldType: WorldType['type']) {
        visibility[playerId] = visibility[playerId] ?? {}
        if (!(visibility[playerId][worldId] === 'PRESENT')) {
          visibility[playerId][worldId] = worldType === 'NEBULA' ? 'FOG_OF_WAR' : 'VISIBLE';
        }
        allPlayerIds.filter(it => it !== playerId).forEach(id => {
          visibility[id] = visibility[id] ?? {}
          if (!visibility[id][worldId]) {
            visibility[id][worldId] = 'HIDDEN'
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
            markWorldPresentForPlayer(result, world.id, playerId)
          }
          if (this.playerHasFleetAtWorld(allFleets, playerId, world)) {
            markWorldPresentForPlayer(result, world.id, playerId)
          }
          const neighboringWorldIds = gates[world.id];
          if (neighboringWorldIds && neighboringWorldIds.some(id => {
            const neighboringWorld = worldsById[id];
            return this.worldOwnedByPlayer(neighboringWorld, playerId) || this.playerHasFleetAtWorld(allFleets, playerId, neighboringWorld)
          })) {
            markWorldVisibleForPlayer(result, world.id, playerId, worldsById[world.id].worldType.type)
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
          if (['VISIBLE', 'PRESENT'].includes(visibility[playerId][worldId]) && !world.worldHasBeenDiscovered) {
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
    return allFleets.some(fleet => fleet.ownerId === playerId && fleetIsAtWorld(fleet) && fleet.currentWorldId === world.id);
  }

  private worldOwnedByPlayer(world: World, playerId: string) {
    return worldHasOwner(world) && world.ownerId === playerId;
  }

}