import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay, tap } from "rxjs/operators";
import { FleetProjector } from "./fleet-projector";
import { combineLatest, Observable } from "rxjs";
import { PlayerProjector } from "./player-projector";
import { Distances } from "../../shared/model/v1/distances";
import { fleetHasOwner, TransferingCargoFleet, WaitingForCargoFleet } from "../../shared/model/v1/fleet";
import { floydWarshall } from "../../shared/math/path-finding/floydWarshall";
import { Gates } from "../../shared/model/v1/universe";
import { WorldProjector } from "./world-projector";
import { worldhasOwner } from "../../shared/model/v1/world";
import { generatePotential } from "../../shared/math/path-finding/potential";
import deepEqual from "deep-equal";

@injectable()
export class CargoProjector {
  constructor(
    private fleets: FleetProjector,
    private players: PlayerProjector,
    private worlds: WorldProjector
  ) { }

  private cargoDistancesByPlayer$ = combineLatest([
    this.fleets.byId$,
    this.players.allPlayerIds$
  ]).pipe(
    map(([fleetsById, allPlayerIds]) => {
      const result: { [playerId: string]: Distances } = {}

      for (const playerId of allPlayerIds) {

        const cargoFleets = Object.values(fleetsById).filter(fleet => {
          return fleetHasOwner(fleet)
            && fleet.ownerId === playerId
            && (fleet.status === 'TRANSFERING_CARGO' || fleet.status === 'WAITING_FOR_CARGO')
        }) as Array<TransferingCargoFleet | WaitingForCargoFleet>;

        const routes: Gates = {}

        for (const cargoFleet of cargoFleets) {

          routes[cargoFleet.fromWorldId] = routes[cargoFleet.fromWorldId] ?? []
          routes[cargoFleet.fromWorldId].push(cargoFleet.toWorldId)
          routes[cargoFleet.toWorldId] = routes[cargoFleet.toWorldId] ?? []
          routes[cargoFleet.toWorldId].push(cargoFleet.fromWorldId)

        }

        result[playerId] = floydWarshall(routes)

      }

      return result;
    }),
    distinctUntilChanged(deepEqual)
  )

  public metalPotentialByPlayer$: Observable<{ [playerId: string]: {[worldId: string]: number} }> = combineLatest([
    this.cargoDistancesByPlayer$,
    this.worlds.byId$
  ]).pipe(map(([cargoDistances, worldsById]) => {

    const result: { [playerId: string]: {[worldId: string]: number} } = {}

    for (const playerId of Object.getOwnPropertyNames(cargoDistances)) {

      const attractivity: { [worldId: string]: number } = {}

      for (const world of Object.values(worldsById)) {
        if (worldhasOwner(world) && world.ownerId === playerId) {
          attractivity[world.id] = Math.max(world.industry - world.metal / 2, 0)
        }
      }

      result[playerId] = generatePotential(attractivity, cargoDistances[playerId])
    }

    return result;
  }), 
  distinctUntilChanged(deepEqual))

}