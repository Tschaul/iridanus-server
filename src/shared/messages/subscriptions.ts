export type Subscription = GamesListAllSubscription
  | MapListAllSubscription
  | MapListFinalSubscription
  | RulesListAllSubscription
  | RulesListFinalSubscription;

export interface GamesListAllSubscription {
  type: 'GAME/LIST_ALL'
}

export interface MapListAllSubscription {
  type: 'MAP/LIST_ALL'
}

export interface MapListFinalSubscription {
  type: 'MAP/LIST_FINAL'
}

export interface RulesListAllSubscription {
  type: 'RULES/LIST_ALL'
}

export interface RulesListFinalSubscription {
  type: 'RULES/LIST_FINAL'
}