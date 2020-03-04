import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom, tap } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { captureWorld } from "../../actions/world/capture";
import { VisibilityProjector } from "../../projectors/visibility-projector";
import { revealWorld } from "../../actions/world/reveal";

@injectable()
export class RevealWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public visibility: VisibilityProjector,
    public time: TimeProjector,
  ) {
    this.upcomingEvent$ = combineLatest(
      this.visibility.nextRevealedWorld$,
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
                revealWorld(worldToReaveal.worldId, worldToReaveal.playerId),
              ];
            }
          }
        }
      })
    )
  }
}
