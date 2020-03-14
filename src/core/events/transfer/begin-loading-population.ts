import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import { getTrueTransferAmount } from "./amount-helper";
import { injectable, inject } from "inversify";
import { FleetProjector } from "../../projectors/fleet-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { LoadPopulationOrder } from "../../../shared/model/v1/fleet-orders";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { loadPopulation } from "../../actions/fleet/load-population";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class BeginLoadingPopulationEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private worlds: WorldProjector,
    private time: TimeProjector,
    private setup: GameSetupProvider) {

    const readyFleetWithTransferPopulationOrder$ = this.fleets.firstByStatusAndNextOrderType<ReadyFleet, LoadPopulationOrder>('READY', 'LOAD_POPULATION')

    this.upcomingEvent$ = combineLatest(
      readyFleetWithTransferPopulationOrder$,
      this.worlds.byId$,
      this.time.currentTimestamp$
    ).pipe(
      map(([[fleet, order], worlds, timestamp]) => {
        if (!fleet || !order) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              const world = worlds[fleet.currentWorldId];

              if (world.status === 'LOST' || fleet.ownerId !== world.ownerId) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              let trueAmount = getTrueTransferAmount(world.population, fleet.population, order.amount, fleet.ships - fleet.metal)

              if (fleet.population + trueAmount > fleet.ships) {
                trueAmount = fleet.ships - fleet.population;
              }

              if (trueAmount === 0) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              return [
                loadPopulation(fleet.id, trueAmount, timestamp + this.setup.rules.transfering.transferPopulationDelay),
                giveOrTakeWorldPopulation(world.id, -1 * trueAmount),
                popFleetOrder(fleet.id)
              ];
            }
          }
        }
      }
      ));
  }
}
