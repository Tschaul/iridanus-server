import { Observable, from, EMPTY } from "rxjs";
import { injectable } from "inversify";
import { map, switchMap, first } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { ReadonlyStore } from "../../../../core/store";
import { GameRepository } from "../../../repositories/games/games-repository";
import { GameSetupProvider } from "../../../../core/game-setup-provider";
import { GameStatsSubscription } from "../../../../shared/messages/subscriptions/game-subscriptions";
import { GameStatsSubscriptionResult } from "../../../../shared/messages/subscriptions/game-subscription-results";
import { StatsProjector } from "../../../../core/projectors/stats-projector";

@injectable()
export class GameStatsDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private stats: StatsProjector,
    private gameRepository: GameRepository,
    private setup: GameSetupProvider
  ){}

  getObservable(subscription: GameStatsSubscription, playerId: string): Observable<GameStatsSubscriptionResult> {

    return this.gameRepository.getGameInfoByIdAsObservable(this.setup.gameId).pipe(
      first(),
      switchMap(gameInfo => {

        if (gameInfo.state === 'PROPOSED') {
          return EMPTY;
        }

        const playerInfo = gameInfo.players[playerId];

        if (!playerInfo) {
          return EMPTY;
        }

        return this.stats.statsByPlayer$.pipe(
          map(({population}) => {
            return {
              type: 'GAME/STATS' as 'GAME/STATS',
              score: population
            }
          })
        ) 
      })
    )
  }
}