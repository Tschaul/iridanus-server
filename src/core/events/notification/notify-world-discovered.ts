import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom, tap } from "rxjs/operators";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { VisibilityProjector } from "../../projectors/visibility-projector";
import { notifyWorldDiscovered } from "../../actions/world/notify-discovered";

@injectable()
export class DiscoverWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public visibility: VisibilityProjector,
  ) {
    this.upcomingEvent$ = this.visibility.nextRevealedWorld$.pipe(
      map((worldToReaveal) => {
        if (!worldToReaveal) {
          return null
        } else {
          return {
            notifications: (timestamp: number) =>  [{
              type: 'NEW_WORLD_DISCOVERED',
              playerId: worldToReaveal.playerId,
              worldId: worldToReaveal.worldId,
              timestamp
            }],
            happen: () => {
              return [
                notifyWorldDiscovered(worldToReaveal.worldId, worldToReaveal.playerId),
              ];
            }
          }
        }
      })
    )
  }
}
