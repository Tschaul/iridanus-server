import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleetBase, ReadyFleet } from "../../../shared/model/v1/fleet";
import { getTrueTransferAmount } from "./amount-helper";
import { injectable, inject } from "inversify";
import { FleetProjector } from "../../projectors/fleet-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { LoadMetalOrder } from "../../../shared/model/v1/fleet-orders";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { loadMetal } from "../../actions/fleet/load-metal";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class BeginLoadingMetalEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private worlds: WorldProjector,
    private time: TimeProjector,
    private setup: GameSetupProvider) {

    const readyFleetWithTransferMetalOrder$ = this.fleets.firstByStatusAndNextOrderType<ReadyFleet, LoadMetalOrder>('READY', 'LOAD_METAL')

    this.upcomingEvent$ = combineLatest(
      readyFleetWithTransferMetalOrder$,
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

              let trueAmount = getTrueTransferAmount(fleet.metal, world.metal, order.amount, this.setup.rules.global.maxAmount)

              if (fleet.metal + trueAmount > fleet.ships) {
                trueAmount = fleet.ships - fleet.metal;
              }

              if (trueAmount === 0) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              return [
                loadMetal(fleet.id, trueAmount, timestamp + this.setup.rules.transfering.transferMetalDelay),
                giveOrTakeWorldMetal(world.id, -1 * trueAmount),
                popFleetOrder(fleet.id)
              ];
            }
          }
        }
      }
      ));
  }
}