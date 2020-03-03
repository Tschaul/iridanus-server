import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { captureFleet } from "../../actions/fleet/capture";

@injectable()
export class CaptureFleetEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public capture: CombatAndCaptureProjector,
    public time: TimeProjector,
  ) {
    this.upcomingEvent$ = combineLatest(
      this.capture.nextCapturedFleet$,
      this.time.currentTimestamp$
    ).pipe(
      map(([[fleet, newOwnerId], timestamp]) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              return [
                captureFleet(fleet.id, newOwnerId),
              ];
            }
          }
        }
      })
    )
  }
}
