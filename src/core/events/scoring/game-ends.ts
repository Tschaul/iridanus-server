import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { InfluenceProjector } from "../../projectors/influence-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { updateScoring } from "../../actions/udpate-influence";
import { GameSetupProvider } from "../../game-setup-provider";
import { Action } from "../../actions/action";

@injectable()
export class GameEndsEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;
  public gameEndingTimestamp$: Observable<number>;

  constructor(
    private influence: InfluenceProjector,
    private time: TimeProjector,
    private setup: GameSetupProvider) {

    this.gameEndingTimestamp$ = combineLatest([
      this.influence.byPlayerId$,
      this.time.gameEndTimestamp$
    ]).pipe(
      map(([scorings, gameEndTimestamp]) => {

        let endGameTimestamp = gameEndTimestamp;

        Object.values(scorings).forEach(scoring => {
          if (scoring.influence > 0) {
            const projectedEnd = scoring.lastScoringTimestamp + ((setup.rules.scoring.gameEndingScore - scoring.score) / scoring.influence)
            if (projectedEnd < gameEndTimestamp) {
              endGameTimestamp = projectedEnd;
            }
          }
        })

        return endGameTimestamp;
      })
    )

    this.upcomingEvent$ = combineLatest([
      this.gameEndingTimestamp$,
      this.influence.byPlayerId$
    ]).pipe(
      map(([timestamp, scorings]) => {
        return {
          endsGame: true,
          timestamp,
          happen: () => {

            const actions: Action[] = [];

            Object.values(scorings).forEach(scoring => {
              actions.push(updateScoring(scoring.playerId, scoring.influence, timestamp))
            })

            return actions;
          }
        }
      })
    )
  }


}

