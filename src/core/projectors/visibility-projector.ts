import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { FleetProjector } from "./fleet-projector";
import { combineLatest, zip, Observable } from "rxjs";
import { WorldProjector } from "./world-projector";
import { map, switchMap, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { worldhasOwner, World } from "../../shared/model/v1/world";
import { Fleet, fleetHasOwner, fleetIsAtWorld } from "../../shared/model/v1/fleet";
import { GatesProjector } from "./gates-projector";
import { VisibleWorld, VisibleState } from "../../shared/model/v1/visible-state";
import { RemeberedWorld, WorldVisibilityStatus } from "../../shared/model/v1/visibility-status";
import equal from 'deep-equal';

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

  public nextRevealedWorld$ = this.visiblity$.pipe(
    switchMap(visibility => {
      const playerIds = Object.getOwnPropertyNames(visibility);
      return zip(...playerIds.map(playerId => {
        return combineLatest(
          this.calculatedVisibleWorldsForPlayer(playerId),
          this.visibleWorldsForPlayerFromStore(playerId)
        ).pipe(
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
    distinctUntilChanged(equal),
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
    distinctUntilChanged(equal),
    shareReplay(1),
  )

  public visibleUniverseForPlayer(playerId: string) {
    return this.store.state$.pipe(
      map(state => {
        const visibilityForPlayer = state.universe.visibility[playerId];
        const fleets = {
          ...state.universe.fleets
        }
        Object.values(state.universe.fleets).filter(fleet => !fleetHasOwner(fleet) || fleet.ownerId !== playerId).forEach(fleet => {
          if (fleet.status === 'WARPING') {
            if (!visibilityForPlayer[fleet.originWorldId]
              || visibilityForPlayer[fleet.originWorldId].status === 'REMEBERED'
              || !visibilityForPlayer[fleet.targetWorldId]
              || visibilityForPlayer[fleet.targetWorldId].status === 'REMEBERED') {
              delete fleets[fleet.id]
            }
          } else if (!visibilityForPlayer[fleet.currentWorldId] || visibilityForPlayer[fleet.currentWorldId].status === 'REMEBERED') {
            delete fleets[fleet.id]
          } else if (fleetHasOwner(fleet) && fleet.ownerId !== playerId) {
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
          } else if (visibilityForPlayer[world.id].status === 'REMEBERED') {
            const rememberedWorld = visibilityForPlayer[world.id];
            worlds[world.id] = rememberedWorld as RemeberedWorld;
          } else if (worldhasOwner(world) && world.ownerId !== playerId) {
            worlds[world.id] = {
              ...worlds[world.id],
              orders: []
            } as World
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
      distinctUntilChanged(equal),
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
    return combineLatest(
      this.worlds.byId$,
      this.fleets.byId$,
      this.gates.all$
    ).pipe(
      map(([worldsById, fleetsById, gates]) => {
        const allFleets = Object.values(fleetsById);
        return Object.values(worldsById).filter(world => {
          if (this.worldOwnedByPlayer(world, playerId)) {
            return true;
          }
          if (this.playerHasFleetKeyAtWorld(allFleets, playerId, world)) {
            return true;
          }
          const neighboringWorldIds = gates[world.id];
          if (neighboringWorldIds && neighboringWorldIds.some(id => {
            const neighboringWorld = worldsById[id];
            return this.worldOwnedByPlayer(neighboringWorld, playerId)
              && this.playerHasFleetKeyAtWorld(allFleets, playerId, neighboringWorld)
          })) {
            return true;
          }
          return false;
        })
      }),
      distinctUntilChanged(equal),
      shareReplay(1),
    )
  }

  private playerHasFleetKeyAtWorld(allFleets: Fleet[], playerId: string, world: World) {
    return allFleets.some(fleet => this.fleetOwnedByPlayer(fleet, playerId) && fleetIsAtWorld(fleet) && fleet.currentWorldId === world.id);
  }

  private worldOwnedByPlayer(world: World, playerId: string) {
    return worldhasOwner(world) && world.ownerId === playerId;
  }

  private fleetOwnedByPlayer(fleet: Fleet, playerId: string) {
    return fleetHasOwner(fleet) && fleet.ownerId === playerId;
  }
}