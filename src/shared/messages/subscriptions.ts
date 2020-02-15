export type Subscription = GamesListAllSubscription
  | GameStateSubscription
  | GameInfoSubscription;

export interface GamesListAllSubscription {
  type: 'GAME/LIST_ALL'
}

export interface GameStateSubscription {
  type: 'GAME/STATE'
}

export interface GameInfoSubscription {
  type: 'GAME/INFO'
}
