import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
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
import { Gates } from "../../../shared/model/v1/universe";
import { GatesProjector } from "../../projectors/gates-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { worldhasOwner } from "../../../shared/model/v1/world";

@injectable()
export class LeaveWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public fleets: FleetProjector,
    public worlds: WorldProjector,
    public time: TimeProjector,
    private setup: GameSetupProvider,
    private gates: GatesProjector
  ) {
    this.upcomingEvent$ = combineLatest(
      this.fleets.firstByStatusAndNextOrderType<ReadyFleet, WarpOrder>('READY', 'WARP'),
      this.time.currentTimestamp$,
      this.gates.all$,
      this.worlds.byId$
    ).pipe(
      map(([[fleet, order], timestamp, gates, worlds]) => {
        if (!fleet || !order) {
          return null
        } else {

          if (fleet.ships === 0 || !gates[fleet.currentWorldId].includes(order.targetWorldId)) {
            return {
              timestamp,
              happen: () => {
                return [
                  popFleetOrder(fleet.id)
                ]
              }
            }
          }

          let delay = this.setup.rules.warping.leaveWorldDelay;

          const currentWorld = worlds[fleet.currentWorldId];
          if (worldhasOwner(currentWorld) &&  currentWorld.ownerId === fleet.ownerId) {
            delay = 0;
          } 

          return {
            timestamp,
            happen: () => {
              return [
                leaveWorld(fleet.id, order.targetWorldId, timestamp + delay),
                popFleetOrder(fleet.id)
              ];
            }
          }
        }
      }))
  }
}
