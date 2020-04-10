import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { TimeProjector } from "../../projectors/time-projector";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { World, ReadyWorld } from "../../../shared/model/v1/world";
import { notifyWorldIdle } from "../../actions/world/notify-idle";

@injectable()
export class NotifyWorldIdleEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private time: TimeProjector,
    private worlds: WorldProjector
  ) {
    const idleFleet$ = worlds.byId$.pipe(map(byId => {
      return Object.values(byId).find((world: World) => {
        return world.status === 'READY' && world.orders.length === 0 && !world.idleNotificationSent;
      })
    })) as Observable<ReadyWorld>

    this.upcomingEvent$ = combineLatest([idleFleet$, this.time.currentTimestamp$]).pipe(map(([world, timestamp]) => {
      if (!world) {
        return null
      }

      return {
        notifications: [{
          type: 'WORLD_AWAITING_ORDERS',
          worldId: world.id,
          playerId: world.ownerId,
          timestamp
        }],
        timestamp,
        happen: () => [
          notifyWorldIdle(world.id)
        ]
      }
    }));
  }
}