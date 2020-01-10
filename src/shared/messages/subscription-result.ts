import { GameInfo } from "../model/v1/game-info";
import { GameMap } from "../model/v1/game-map";

export type SubscriptionResult = GameListAllSubscriptionResult
 | MapListAllSubscriptionResult;

export interface GameListAllSubscriptionResult {
  type: 'GAME/LIST_ALL',
  games: GameInfo[]
}

export interface MapListAllSubscriptionResult {
  type: 'MAP/LIST_ALL',
  maps: GameMap[]
}