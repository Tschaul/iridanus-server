import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleet } from "../../model/fleet";
import { getTrueTransferAmount } from "./amount-helper";
import { injectable, inject } from "inversify";
import 'reflect-metadata'
import { FleetProjector } from "../../projectors/fleet-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { CONFIG, GameConfig } from "../../config";
import { TransferMetalOrder } from "../../model/fleet-orders";
import { popOrder } from "../../actions/fleet/pop-order";
import { transferMetal } from "../../actions/fleet/transfer-metal";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";

@injectable()
export class BeginTransferMetalEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(private fleets: FleetProjector, private worlds: WorldProjector, private time: TimeProjector, @inject(CONFIG) private config: GameConfig) {

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

              if (fleet.ownerId !== world.ownerId) {
                return [
                  popOrder(fleet.id)
                ]
              }

              let trueAmount = getTrueTransferAmount(fleet.metal, world.metal, order.amount)

              if (fleet.metal + trueAmount > fleet.ships) {
                trueAmount = fleet.ships - fleet.metal;
              }

              if (trueAmount === 0) {
                return [
                  popOrder(fleet.id)
                ]
              }

              return [
                transferMetal(fleet.id, trueAmount, timestamp + config.transferMetalDelay),
                giveOrTakeWorldMetal(world.id, -1 * trueAmount),
                popOrder(fleet.id)
              ];
            }
          }
        }
      }
      ));
  }
}
