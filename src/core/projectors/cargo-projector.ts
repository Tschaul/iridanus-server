import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { FleetProjector } from "./fleet-projector";
import { combineLatest } from "rxjs";
import { PlayerProjector } from "./player-projector";
import { Distances } from "../../shared/model/v1/distances";
import { fleetHasOwner, TransferingCargoFleet, WaitingForCargoFleet } from "../../shared/model/v1/fleet";
import { floydWarshall } from "../../shared/math/path-finding/floydWarshall";
import { Gates } from "../../shared/model/v1/universe";
import { gates } from "../../util/hex-map/gomeisa-three-random";

@injectable()
export class GatesProjector {
  constructor(
    private store: ReadonlyStore,
    private fleets: FleetProjector,
    private players: PlayerProjector
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

          let [world1, world2] = cargoFleet.status === 'TRANSFERING_CARGO' 
            ? [cargoFleet.fromWorldId, cargoFleet.toWorldId]
            : [cargoFleet.atWorldId, cargoFleet.otherWorldId]


            routes[world1] = routes[world1] ?? []
            routes[world1].push(world2)
            routes[world2] = routes[world2] ?? []
            routes[world2].push(world1)
          
        }

        result[playerId] = floydWarshall(gates)

      }
    })
  )

}