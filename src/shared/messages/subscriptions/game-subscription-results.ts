import { GameInfo, GameMetaData } from "../../model/v1/game-info";
import { VisibleState } from "../../model/v1/visible-state";
import { PersistedGameNotification } from "../../model/v1/notification";
import { GameRules } from "../../model/v1/rules";
import { Distribution } from "../../math/distributions/distribution-helper";
import { GameAnalytics } from "../../model/v1/game-analytics";

export type GameSubscriptionResult = GameListAllSubscriptionResult
  | GameStateSubscriptionResult
  | GameInfoSubscriptionResult
  | GameMetaDataSubscriptionResult
  | GameNotificationsSubscriptionResult
  | GameRulesSubscriptionResult
  | GameStatsSubscriptionResult
  | GameAnalyticsSubscriptionResult;

export interface GameListAllSubscriptionResult {
  type: 'GAME/LIST_ALL',
  games: GameInfo[]
}

export interface GameStateSubscriptionResult {
  type: 'GAME/STATE',
  state: VisibleState
}

export interface GameAnalyticsSubscriptionResult {
  type: 'GAME/ANALYTICS',
  analytics: GameAnalytics
}

export interface GameStatsSubscriptionResult {
  type: 'GAME/STATS',
  score: Distribution
}

export interface GameInfoSubscriptionResult {
  type: 'GAME/INFO',
  info: GameInfo
}

export interface GameRulesSubscriptionResult {
  type: 'GAME/RULES',
  rules: GameRules
}

export interface GameMetaDataSubscriptionResult {
  type: 'GAME/META_DATA',
  data: GameMetaData
}

export interface GameNotificationsSubscriptionResult {
  type: 'GAME/NOTIFICATIONS',
  notifications: PersistedGameNotification[]
}
