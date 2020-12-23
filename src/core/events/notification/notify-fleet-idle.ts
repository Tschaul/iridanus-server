import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { FleetProjector } from "../../projectors/fleet-projector";
import { Fleet, ReadyFleet } from "../../../shared/model/v1/fleet";
import { TimeProjector } from "../../projectors/time-projector";
import { notifyFleetIdle } from "../../actions/fleet/notify-idle";
import { map } from "rxjs/operators";

@injectable()
export class NotifyFleetIdleEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private time: TimeProjector,
    private fleets: FleetProjector
  ) {
    const idleFleet$ = fleets.byId$.pipe(map(fleetsById => {
      return Object.values(fleetsById).find((fleet: Fleet) => {
        return (fleet.status === 'READY' && fleet.orders.length === 0 && !fleet.idleNotificationSent)
          || (fleet.status === 'WAITING_FOR_CARGO' && fleet.orders.length === 0 && !fleet.idleNotificationSent);
      })
    })) as Observable<ReadyFleet>

    this.upcomingEvent$ = idleFleet$.pipe(map((fleet) => {
      if (!fleet) {
        return null
      }

      return {
        notifications: (timestamp) => [{
          type: 'FLEET_AWAITING_ORDERS',
          fleetId: fleet.id,
          worldId: fleet.currentWorldId,
          playerId: fleet.ownerId,
          timestamp
        }],
        happen: () => [
          notifyFleetIdle(fleet.id)
        ]
      }
    }));
  }
}