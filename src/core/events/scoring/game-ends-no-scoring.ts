import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { TimeProjector } from "../../projectors/time-projector";

@injectable()
export class GameEndsNoScoringEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;
  public gameEndingTimestamp$: Observable<number | undefined>;

  constructor(private time: TimeProjector) {

    this.upcomingEvent$ = this.time.gameEndTimestamp$.pipe(
      map(gameEndTimestamp => {
        return {
          endsGame: true,
          timestamp: gameEndTimestamp,
          happen: () => {
            return [
            ]
          }
        }
      })
    )
  }


}

