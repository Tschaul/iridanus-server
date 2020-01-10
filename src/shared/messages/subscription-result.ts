import { GameInfo } from "../model/v1/game-info";
import { GameMap } from "../model/v1/game-map";
import { GameRuleSet } from "../model/v1/rules";

export type SubscriptionResult = GameListAllSubscriptionResult
  | MapListAllSubscriptionResult
  | MapListFinalSubscriptionResult
  | RulesListAllSubscriptionResult
  | RulesListFinalSubscriptionResult;

export interface GameListAllSubscriptionResult {
  type: 'GAME/LIST_ALL',
  games: GameInfo[]
}

export interface MapListAllSubscriptionResult {
  type: 'MAP/LIST_ALL',
  maps: GameMap[]
}

export interface MapListFinalSubscriptionResult {
  type: 'MAP/LIST_FINAL',
  maps: GameMap[]
}

export interface RulesListAllSubscriptionResult {
  type: 'RULES/LIST_ALL',
  rules: GameRuleSet[]
}

export interface RulesListFinalSubscriptionResult {
  type: 'RULES/LIST_FINAL',
  rules: GameRuleSet[]
}