import { SocketConnection } from "../socket-connection";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { GameInfo, GameMetaData } from "../../../shared/model/v1/game-info";
import { VisibleState } from "../../../shared/model/v1/visible-state";
import { GameStateSubscription, GameInfoSubscription, GameMetaDataSubscription, GameRulesSubscription, GameStatsSubscription } from "../../../shared/messages/subscriptions/game-subscriptions";
import { GameStateSubscriptionResult, GameInfoSubscriptionResult, GameMetaDataSubscriptionResult, GameRulesSubscriptionResult, GameStatsSubscriptionResult } from "../../../shared/messages/subscriptions/game-subscription-results";
import { GameRules } from "../../../shared/model/v1/rules";
import { Distribution } from "../../../shared/math/distributions/distribution-helper";

@injectable()
export class GameStateService {

  constructor(
    private connection: SocketConnection
  ) { }

  getGameStateById(gameId: string) {
    return this.connection.subscribe<GameStateSubscription, GameStateSubscriptionResult>({
      type: 'GAME/STATE'
    }, gameId).pipe(
      map(result => result.state)
    ) as Observable<VisibleState>
  }

  getGameScoreById(gameId: string) {
    return this.connection.subscribe<GameStatsSubscription, GameStatsSubscriptionResult>({
      type: 'GAME/STATS'
    }, gameId).pipe(
      map(result => result.score)
    ) as Observable<Distribution>
  }

  getGameInfoById(gameId: string) {
    return this.connection.subscribe<GameInfoSubscription, GameInfoSubscriptionResult>({
      type: 'GAME/INFO'
    }, gameId).pipe(
      map(result => result.info)
    ) as Observable<GameInfo>
  }

  getGameRulesByGameId(gameId: string) {
    return this.connection.subscribe<GameRulesSubscription, GameRulesSubscriptionResult>({
      type: 'GAME/RULES'
    }, gameId).pipe(
      map(result => result.rules)
    ) as Observable<GameRules>
  }

  getGameMetaDataById(gameId: string) {
    return this.connection.subscribe<GameMetaDataSubscription, GameMetaDataSubscriptionResult>({
      type: 'GAME/META_DATA'
    }, gameId).pipe(
      map(result => result.data)
    ) as Observable<GameMetaData>
  }
}