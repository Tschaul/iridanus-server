import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { StatsProjector } from "../../projectors/influence-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { GameSetupProvider } from "../../game-setup-provider";
import { PlayerProjector } from "../../projectors/player-projector";
import { majorityHolder } from "../../../shared/math/distributions/distribution-helper";
import { playerWins } from "../../actions/player/player-wins";

@injectable()
export class GameEndsEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;
  public gameEndingTimestamp$: Observable<number | undefined>;

  constructor(
    private stats: StatsProjector,
    private time: TimeProjector,
    private players: PlayerProjector,
    private setup: GameSetupProvider) {

    this.gameEndingTimestamp$ = combineLatest([
      this.stats.statsByPlayer$,
      this.time.gameEndTimestamp$
    ]).pipe(
      map(([{ population: populationByPlyer }, gameEndTimestamp]) => {

        let endGameTimestamp = gameEndTimestamp;

        if (Object.values(populationByPlyer).find(score => {
          return score >= this.setup.rules.scoring.gameEndingScore
        })) {
          return undefined;
        }

        return endGameTimestamp;
      })
    )

    this.upcomingEvent$ = combineLatest([
      this.gameEndingTimestamp$,
      this.stats.statsByPlayer$,
      this.players.allPlayerIds$
    ]).pipe(
      map(([gameEndTimestamp, { population }, allPlayerIds]) => {
        return {
          notifications: (timestamp) => allPlayerIds.map(it => {
            return {
              type: 'GAME_ENDED',
              playerId: it,
              timestamp
            }
          }),
          endsGame: true,
          timestamp: gameEndTimestamp,
          happen: () => {

            const winner = majorityHolder(population);

            if (!winner) {
              throw new Error("No player has any population and game ended.");
            }

            return [
              playerWins(winner)
            ]
          }
        }
      })
    )
  }


}

