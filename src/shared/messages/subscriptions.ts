export type Subscription = GamesListAllSubscription
  | GameStateSubscription;

export interface GamesListAllSubscription {
  type: 'GAME/LIST_ALL'
}
export interface GameStateSubscription {
  type: 'GAME/STATE'
}
