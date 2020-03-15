import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { stopCapturingWorld } from "../../actions/world/stop-capturing";

@injectable()
export class StopCapturingWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public capture: CombatAndCaptureProjector,
    public time: TimeProjector,
  ) {
    this.upcomingEvent$ = combineLatest(
      this.capture.nextStopCapturingWorld$,
      this.time.currentTimestamp$
    ).pipe(
      map(([world, timestamp]) => {
        if (!world) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {

              return [
                stopCapturingWorld(world.id),
              ];
            }
          }
        }
      })
    )
  }
}
