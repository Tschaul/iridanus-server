import { Observable, from, EMPTY } from "rxjs";
import { injectable } from "inversify";
import { map, switchMap, first } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { VisibilityProjector } from "../../../../core/projectors/visibility-projector";
import { GameStateSubscription } from "../../../../shared/messages/subscriptions/game-subscriptions";
import { GameAnalyticsSubscriptionResult, GameStateSubscriptionResult } from "../../../../shared/messages/subscriptions/game-subscription-results";
import { ReadonlyStore } from "../../../../core/store";
import { GameRepository } from "../../../repositories/games/games-repository";
import { GameSetupProvider } from "../../../../core/game-setup-provider";
import { AnalyticsCurveItem } from "../../../../shared/model/v1/game-analytics";
import { StatsProjector } from "../../../../core/projectors/stats-projector";
import deepEqual from "deep-equal";
import { Environment } from "../../../environment/environment";

@injectable()
export class GameAnalyticsDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private visibility: VisibilityProjector,
    private store: ReadonlyStore,
    private gameRepository: GameRepository,
    private setup: GameSetupProvider,
    private projector: StatsProjector,
    private environment: Environment
  ) { }

  getObservable(subscription: GameStateSubscription, playerId: string): Observable<GameAnalyticsSubscriptionResult> {

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

        if (!playerInfo.isSpectator && gameInfo.state !== 'ENDED') {
          return EMPTY;
        }

        return this.gameRepository.getGameHistory(this.setup.gameId).pipe(
          first(),
          map(history => {

            const timestamps = Object.getOwnPropertyNames(history).sort((a,b) => {
              return parseFloat(b) - parseFloat(a)
            }) as unknown as number[];

            const curve: AnalyticsCurveItem[] = [];

            let lastStats: any | null = null;
            // let lastTimestamp: number | null = null;

            timestamps.forEach((timestamp) => {
              const state = history[timestamp];

              const playerIds = Object.getOwnPropertyNames(state.players).filter(it => !it.startsWith('@'));

              const newStats = this.projector.extractStats(playerIds, state.universe.worlds, state.universe.fleets)

              if (!deepEqual(lastStats, newStats)) {
                lastStats = newStats;
                curve.push({
                  timestamp: parseInt(timestamp as unknown as string),
                  ...newStats
                })
              }

            })

            return {
              type: 'GAME/ANALYTICS' as 'GAME/ANALYTICS',
              analytics: { curve }
            }
          })
        )

      })
    )
  }
}