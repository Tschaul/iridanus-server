import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { VisibilityProjector } from "../../projectors/visibility-projector";
import { rememberWorld } from "../../actions/world/remeber";

@injectable()
export class RememberWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public visibility: VisibilityProjector,
    public time: TimeProjector,
  ) {
    this.upcomingEvent$ = combineLatest(
      this.visibility.nextWorldToHide$,
      this.time.currentTimestamp$
    ).pipe(
      map(([worldToReaveal, timestamp]) => {
        if (!worldToReaveal) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              return [
                rememberWorld(worldToReaveal.worldId, worldToReaveal.playerId),
              ];
            }
          }
        }
      })
    )
  }
}
