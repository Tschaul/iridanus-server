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
  ) {
    this.upcomingEvent$ = this.visibility.nextWorldToHide$.pipe(
      map((worldToReaveal) => {
        if (!worldToReaveal) {
          return null
        } else {
          return {
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
