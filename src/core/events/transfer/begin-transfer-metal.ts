import { GameEvent, GameEventQueue } from "../event";
import { PopOrderAction } from "../../actions/fleet/pop-order";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleet } from "../../model/fleet";
import { getTrueTransferAmount } from "./amount-helper";
import { TransferMetalAction } from "../../actions/fleet/transfer-metal";
import { GiveOrTakeWorldMetalAction } from "../../actions/world/give-or-take-metal";
import { injectable, inject } from "inversify";
import 'reflect-metadata'
import { FleetProjector } from "../../projectors/fleet-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { CONFIG, GameConfig } from "../../config";
import { TransferMetalOrder } from "../../model/fleet-orders";

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
                  new PopOrderAction(fleet.id)
                ]
              }

              const trueAmount = getTrueTransferAmount(fleet.metal, world.metal, order.amount)

              if (trueAmount === 0) {
                return [
                  new PopOrderAction(fleet.id)
                ]
              }

              return [
                new TransferMetalAction(fleet.id, trueAmount, timestamp + config.transferMetalDelay),
                new GiveOrTakeWorldMetalAction(world.id, -1 * trueAmount),
                new PopOrderAction(fleet.id)
              ];
            }
          }
        }
      }
      ));
  }
}
