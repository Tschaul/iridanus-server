import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay, tap, pairwise, startWith, scan } from "rxjs/operators";
import { FleetProjector } from "./fleet-projector";
import { combineLatest, Observable } from "rxjs";
import { PlayerProjector } from "./player-projector";
import { Distances } from "../../shared/model/v1/distances";
import { TransferingCargoFleet, WaitingForCargoFleet } from "../../shared/model/v1/fleet";
import { floydWarshallDistances, floydWarshallGates } from "../../shared/math/path-finding/floydWarshall";
import { Gates } from "../../shared/model/v1/universe";
import { WorldProjector } from "./world-projector";
import { World, worldHasOwner } from "../../shared/model/v1/world";
import { generatePotential } from "../../shared/math/path-finding/potential";
import equal from "deep-equal";

export type DistancesByPlayer = { [playerId: string]: Distances };

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
      const result: DistancesByPlayer = {}

      for (const playerId of allPlayerIds) {

        const cargoFleets = Object.values(fleetsById).filter(fleet => {
          return fleet.ownerId === playerId
            && (fleet.status === 'TRANSFERING_CARGO' || fleet.status === 'WAITING_FOR_CARGO')
        }) as Array<TransferingCargoFleet | WaitingForCargoFleet>;

        const routes: Distances = {}

        for (const cargoFleet of cargoFleets) {

          const fromWorldId = cargoFleet.cargoRoute[0]
          const toWorldId = cargoFleet.cargoRoute[cargoFleet.cargoRoute.length - 1]

          routes[fromWorldId] = routes[fromWorldId] ?? {}
          routes[fromWorldId][toWorldId] = cargoFleet.cargoRoute.length - 1
          routes[toWorldId] = routes[toWorldId] ?? {}
          routes[toWorldId][fromWorldId] = cargoFleet.cargoRoute.length - 1

        }

        result[playerId] = routes

      }

      return result;
    }),
    distinctUntilChanged(equal),
    startWith({}),
    pairwise(),
    scan<[DistancesByPlayer, DistancesByPlayer], DistancesByPlayer>((acc, [oldRoutes, newRoutes]) => {
      const result: { [playerId: string]: Distances } = {}
      for (const playerId of Object.getOwnPropertyNames(newRoutes)) {
        if (equal(newRoutes[playerId], oldRoutes[playerId]) && acc[playerId]) {
          result[playerId] = acc[playerId]
        } else {
          result[playerId] = floydWarshallDistances(newRoutes[playerId])
        }
      }
      return result;
    }, {})
  )

  public metalPotentialByPlayer$: Observable<{ [playerId: string]: { [worldId: string]: number } }> = combineLatest([
    this.cargoDistancesByPlayer$,
    this.worlds.byId$
  ]).pipe(map(([cargoDistances, worldsById]) => {

    const result: { [playerId: string]: { [worldId: string]: number } } = {}

    for (const playerId of Object.getOwnPropertyNames(cargoDistances)) {

      const attractivity: { [worldId: string]: number } = {}

      for (const world of Object.values(worldsById)) {
        if (worldHasOwner(world) && world.ownerId === playerId) {
          attractivity[world.id] = Math.max(world.industry - world.metal / 2, 0)
        }
      }

      result[playerId] = generatePotential(attractivity, cargoDistances[playerId])

    }

    return result;
  }), distinctUntilChanged(equal))

}