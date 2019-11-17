import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleetBase, ReadyFleet } from "../../../shared/model/fleet";
import { getTrueTransferAmount } from "./amount-helper";
import { injectable, inject } from "inversify";
import { FleetProjector } from "../../projectors/fleet-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { TransferMetalOrder } from "../../../shared/model/fleet-orders";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { transferMetal } from "../../actions/fleet/transfer-metal";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class BeginTransferMetalEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector, 
    private worlds: WorldProjector, 
    private time: TimeProjector, 
    private setup: GameSetupProvider) {

    const readyFleetWithTransferMetalOrder$ = this.fleets.firstByStatusAndNextOrderType<ReadyFleet, TransferMetalOrder>('READY', 'TRANSFER_METAL')

    this.upcomingEvent$ = readyFleetWithTransferMetalOrder$.pipe(
      withLatestFrom(this.worlds.byId$, this.time.currentTimestamp$),
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

              let trueAmount = getTrueTransferAmount(fleet.metal, world.metal, order.amount)

              if (fleet.metal + trueAmount > fleet.ships) {
                trueAmount = fleet.ships - fleet.metal;
              }

              if (trueAmount === 0) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              return [
                transferMetal(fleet.id, trueAmount, timestamp + this.setup.rules.transfering.transferMetalDelay),
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
