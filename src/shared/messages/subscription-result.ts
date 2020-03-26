import { GameInfo, GameMetaData } from "../model/v1/game-info";
import { GameState } from "../model/v1/state";
import { VisibleState } from "../model/v1/visible-state";
import { GameNotification, PersistedGameNotification } from "../model/v1/notification";

export type SubscriptionResult = GameListAllSubscriptionResult
  | GameStateSubscriptionResult
  | GameInfoSubscriptionResult
  | GameMetaDataSubscriptionResult
  | GameNotificationsSubscriptionResult;

export interface GameListAllSubscriptionResult {
  type: 'GAME/LIST_ALL',
  games: GameInfo[]
}

export interface GameStateSubscriptionResult {
  type: 'GAME/STATE',
  state: VisibleState
}

export interface GameInfoSubscriptionResult {
  type: 'GAME/INFO',
  info: GameInfo
}

export interface GameMetaDataSubscriptionResult {
  type: 'GAME/META_DATA',
  data: GameMetaData
}

export interface GameNotificationsSubscriptionResult {
  type: 'GAME/NOTIFICATIONS',
  notifications: PersistedGameNotification[]
}
