import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleetBase, ReadyFleet } from "../../../shared/model/v1/fleet";
import { getTrueTransferAmount } from "./amount-helper";
import { injectable, inject } from "inversify";
import { FleetProjector } from "../../projectors/fleet-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { DropPopulationOrder } from "../../../shared/model/v1/fleet-orders";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { GameSetupProvider } from "../../game-setup-provider";
import { giveOrTakeFleetPopulation } from "../../actions/fleet/give-or-take-population";
import { dropPopulation } from "../../actions/fleet/drop-population";

@injectable()
export class BeginDroppingPopulationEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private worlds: WorldProjector,
    private time: TimeProjector,
    private setup: GameSetupProvider) {

    const readyFleetWithTransferPopulationOrder$ = this.fleets.firstByStatusAndNextOrderType<ReadyFleet, DropPopulationOrder>('READY', 'DROP_POPULATION')

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

              let trueAmount = getTrueTransferAmount(fleet.population, world.population, order.amount, world.populationLimit)

              if (trueAmount === 0) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              return [
                dropPopulation(fleet.id, trueAmount, timestamp + this.setup.rules.transfering.transferPopulationDelay),
                giveOrTakeFleetPopulation(fleet.id, -1 * trueAmount),
                popFleetOrder(fleet.id)
              ];
            }
          }
        }
      }
      ));
  }
}
