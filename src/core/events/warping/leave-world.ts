import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleetBase, ReadyFleet } from "../../model/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { inject } from "inversify";
import { GameConfig, CONFIG } from "../../config";
import { WarpOrder } from "../../model/fleet-orders";
import { TimeProjector } from "../../projectors/time-projector";
import { injectable } from "inversify";
import 'reflect-metadata'
import { leaveWorld } from "../../actions/fleet/leave-world";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";

@injectable()
export class LeaveWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(public fleets: FleetProjector, public time: TimeProjector, @inject(CONFIG) config: GameConfig) {
    this.upcomingEvent$ = this.fleets.firstByStatusAndNextOrderType<ReadyFleet, WarpOrder>('READY', 'WARP').pipe(
      withLatestFrom(this.time.currentTimestamp$),
      map(([[fleet, order], timestamp]) => {
        if (!fleet || !order) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              return [
                leaveWorld(fleet.id, order.targetWorldId, timestamp + config.warping.leaveWorldDelay),
                popFleetOrder(fleet.id)
              ];
            }
          }
        }
      }))
  }
}
