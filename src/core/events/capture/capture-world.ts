import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { captureWorld } from "../../actions/world/capture";

@injectable()
export class CaptureWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public capture: CombatAndCaptureProjector,
    public time: TimeProjector,
  ) {
    this.upcomingEvent$ = this.capture.nextCapturedWorld$.pipe(
      map(([world, newOwnerId]) => {
        if (!world) {
          return null
        } else {
          return {
            notifications: (timestamp) =>  [{
              type: 'WORLD_CAPTURED',
              worldId: world.id,
              playerId: newOwnerId,
              timestamp
            }],
            timestamp: world.captureTimestamp,
            happen: () => {
              return [
                captureWorld(world.id, newOwnerId),
              ];
            }
          }
        }
      })
    )
  }
}
