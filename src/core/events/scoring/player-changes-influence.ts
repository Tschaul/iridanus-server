import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { GameSetupProvider } from "../../game-setup-provider";
import { WorldProjector } from "../../projectors/world-projector";
import { GrowingWorld, World } from "../../../shared/model/v1/world";
import { worldStartGrowing } from "../../actions/world/start-growing";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { InfluenceProjector } from "../../projectors/influence-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { updateScoring } from "../../actions/udpate-influence";

@injectable()
export class PlayerChangesInfluenceEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private influence: InfluenceProjector,
    private time: TimeProjector) {

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

