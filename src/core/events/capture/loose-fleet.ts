import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { looseFleet } from "../../actions/fleet/loose";

@injectable()
export class LooseFleetEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public capture: CombatAndCaptureProjector,
    public time: TimeProjector,
  ) {
    this.upcomingEvent$ = combineLatest(
      this.capture.nextLostFleet$,
      this.time.currentTimestamp$
    ).pipe(
      map(([fleet, timestamp]) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              return [
                looseFleet(fleet.id),
              ];
            }
          }
        }
      })
    )
  }
}
