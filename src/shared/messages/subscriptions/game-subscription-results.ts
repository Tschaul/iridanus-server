import { GameInfo, GameMetaData } from "../../model/v1/game-info";
import { VisibleState } from "../../model/v1/visible-state";
import { PersistedGameNotification } from "../../model/v1/notification";

export type GameSubscriptionResult = GameListAllSubscriptionResult
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
