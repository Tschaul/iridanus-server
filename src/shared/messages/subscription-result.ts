import { GameInfo } from "../model/v1/game-info";
import { GameState } from "../model/v1/state";

export type SubscriptionResult = GameListAllSubscriptionResult
  | GameStateSubscriptionResult
  | GameInfoSubscriptionResult;

export interface GameListAllSubscriptionResult {
  type: 'GAME/LIST_ALL',
  games: GameInfo[]
}

export interface GameStateSubscriptionResult {
  type: 'GAME/STATE',
  state: GameState
}

export interface GameInfoSubscriptionResult {
  type: 'GAME/INFO',
  info: GameInfo
}
