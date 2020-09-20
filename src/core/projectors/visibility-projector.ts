import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { FleetProjector } from "./fleet-projector";
import { combineLatest, zip, Observable } from "rxjs";
import { WorldProjector } from "./world-projector";
import { map, switchMap, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { worldhasOwner, World } from "../../shared/model/v1/world";
import { Fleet, FleetInTransit, fleetIsAtWorld, pathOfFleetInTransit } from "../../shared/model/v1/fleet";
import { GatesProjector } from "./gates-projector";
import { VisibleWorld, VisibleState } from "../../shared/model/v1/visible-state";
import { RemeberedWorld, WorldVisibilityStatus } from "../../shared/model/v1/visibility-status";

export interface WorldToRevealOrHide {
  worldId: string,
  playerId: string,
  currentVisibility: WorldVisibilityStatus
}

@injectable()
export class VisibilityProjector {
  constructor(
    private store: ReadonlyStore,
    private worlds: WorldProjector,
    private fleets: FleetProjector,
    private gates: GatesProjector
  ) { }

  private visiblity$ = this.store.state$.pipe(map(state => state.universe.visibility));

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

  public nextRevealedWorld$ = this.visiblity$.pipe(
    switchMap(visibility => {
      const playerIds = Object.getOwnPropertyNames(visibility);
      return zip(...playerIds.map(playerId => {
        return combineLatest([
          this.calculatedVisibleWorldsForPlayer(playerId),
          this.visibleWorldsForPlayerFromStore(playerId)
        ]).pipe(
          map(([calculatedWorlds, currentlyVisibleIds]) => {
            const idToReveal = calculatedWorlds.find(world => !currentlyVisibleIds.includes(world.id))?.id
            return idToReveal ? {
              worldId: idToReveal,
              playerId,
              currentVisibility: visibility[playerId][idToReveal]
            } as WorldToRevealOrHide : null;
          })
        )
      })).pipe(
        map(idsToRevealWithPlayerId => {
          return idsToRevealWithPlayerId.find(it => it) || null;
        })
      )
    }),
    shareReplay(1),
  ) as Observable<WorldToRevealOrHide | null>

  public nextWorldToHide$ = this.visiblity$.pipe(
    switchMap(visibility => {
      const playerIds = Object.getOwnPropertyNames(visibility);
      return zip(...playerIds.map(playerId => {
        return combineLatest(
          this.calculatedVisibleWorldsForPlayer(playerId),
          this.visibleWorldsForPlayerFromStore(playerId)
        ).pipe(
          map(([calculatedWorlds, currentlyVisibleIds]) => {
            const idToHide = currentlyVisibleIds.find(id => !calculatedWorlds.some(world => world.id === id))
            return idToHide ? { worldId: idToHide, playerId } as WorldToRevealOrHide : null;
          })
        )
      })).pipe(
        map(idsToRevealWithPlayerId => {
          return idsToRevealWithPlayerId.find(it => it) || null;
        })
      )
    }),
    shareReplay(1),
  )

  public visibleUniverseForPlayer(playerId: string): Observable<VisibleState> {
    return this.store.state$.pipe(
      map(state => {
        const visibilityForPlayer = state.universe.visibility[playerId];
        const fleets = {
          ...state.universe.fleets
        }

        const worldIsNotVisible = (worldId: string) => {
          return !visibilityForPlayer[worldId]
            || visibilityForPlayer[worldId].status === 'REMEMBERED'
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
          } else if (visibilityForPlayer[world.id].status === 'REMEMBERED') {
            const rememberedWorld = visibilityForPlayer[world.id];
            worlds[world.id] = rememberedWorld as RemeberedWorld;
          }
        })

        const result: VisibleState = {
          currentTimestamp: state.currentTimestamp,
          gameEndTimestamp: state.gameEndTimestamp,
          gameStartTimestamp: state.gameStartTimestamp,
          scorings: state.scorings,
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

  private visibleWorldsForPlayerFromStore(playerId: string) {
    return this.visiblity$.pipe(map(visibility => {
      const visibilityForPlayer = visibility[playerId];
      return Object.values(visibilityForPlayer)
        .filter(visibilityStatus => visibilityStatus.status === 'VISIBLE')
        .map(it => it.id);
    }))
  }

  private calculatedVisibleWorldsForPlayer(playerId: string): Observable<World[]> {
    return combineLatest([
      this.worlds.byId$,
      this.fleets.byId$,
      this.gates.all$
    ]).pipe(
      map(([worldsById, fleetsById, gates]) => {
        const allFleets = Object.values(fleetsById);
        return Object.values(worldsById).filter(world => {
          if (this.worldOwnedByPlayer(world, playerId)) {
            return true;
          }
          if (this.playerHasFleetAtWorld(allFleets, playerId, world)) {
            return true;
          }
          const neighboringWorldIds = gates[world.id];
          if (neighboringWorldIds && neighboringWorldIds.some(id => {
            const neighboringWorld = worldsById[id];
            return this.worldOwnedByPlayer(neighboringWorld, playerId) || this.playerHasFleetAtWorld(allFleets, playerId, neighboringWorld)
          })) {
            return true;
          }
          return false;
        })
      }),
      shareReplay(1),
    )
  }

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