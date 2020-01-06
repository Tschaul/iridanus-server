import { GameInfo } from "../model/v1/game-info";

export type SubscriptionResult = GamesSubscriptionResult
  | DummySubscriptionResult;

export interface GamesSubscriptionResult {
  type: 'GAME/LIST',
  games: GameInfo[]
}

export interface DummySubscriptionResult {
  type: 'DUMMY_COUNTER',
  i: number
}