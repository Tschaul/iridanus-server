import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom, tap } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { captureWorld } from "../../actions/world/capture";
import { VisibilityProjector } from "../../projectors/visibility-projector";
import { revealWorld } from "../../actions/world/reveal";
import { GameNotification } from "../../../shared/model/v1/notification";

@injectable()
export class RevealWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public visibility: VisibilityProjector,
    public time: TimeProjector,
  ) {
    this.upcomingEvent$ = this.visibility.nextRevealedWorld$.pipe(
      map((worldToReaveal) => {
        if (!worldToReaveal) {
          return null
        } else {
          return {
            notifications: (timestamp: number) =>  worldToReaveal.currentVisibility ? [] : [{
              type: 'NEW_WORLD_DISCOVERED',
              playerId: worldToReaveal.playerId,
              worldId: worldToReaveal.worldId,
              timestamp
            }],
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
