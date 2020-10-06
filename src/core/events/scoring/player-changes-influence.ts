import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { InfluenceProjector } from "../../projectors/influence-projector";
import { updateScoring } from "../../actions/udpate-influence";

@injectable()
export class PlayerChangesInfluenceEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private influence: InfluenceProjector) {

      this.upcomingEvent$ = this.influence.playerNeedsInfluenceUpdate$.pipe(
      map(([playerId, newInfluence]) => {
        if (!playerId) {
          return null;
        }
        return {
          happen: (timestamp: number) => {
            return [
              updateScoring(playerId as string, newInfluence as number, timestamp)
            ]
          }
        }
      })
    )
  }

}

