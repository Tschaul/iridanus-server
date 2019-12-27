import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleetBase, ReadyFleet } from "../../../shared/model/v1/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { inject } from "inversify";
import { WarpOrder } from "../../../shared/model/v1/fleet-orders";
import { TimeProjector } from "../../projectors/time-projector";
import { injectable } from "inversify";
import { leaveWorld } from "../../actions/fleet/leave-world";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class LeaveWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public fleets: FleetProjector,
    public time: TimeProjector,
    private setup: GameSetupProvider
  ) {
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
                leaveWorld(fleet.id, order.targetWorldId, timestamp + this.setup.rules.warping.leaveWorldDelay),
                popFleetOrder(fleet.id)
              ];
            }
          }
        }
      }))
  }
}
