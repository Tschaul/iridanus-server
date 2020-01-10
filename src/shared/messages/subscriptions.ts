export type Subscription = GamesListAllSubscription
  | MapListAllSubscription;

export interface GamesListAllSubscription {
  type: 'GAME/LIST_ALL'
}

export interface MapListAllSubscription {
  type: 'MAP/LIST_ALL'
}