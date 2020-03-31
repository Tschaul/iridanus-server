export type GameSubscription = GamesListAllSubscription
  | GameStateSubscription
  | GameInfoSubscription
  | GameMetaDataSubscription
  | GameNotificationsSubscription;

export interface GamesListAllSubscription {
  type: 'GAME/LIST_ALL'
}

export interface GameStateSubscription {
  type: 'GAME/STATE'
}

export interface GameInfoSubscription {
  type: 'GAME/INFO'
}

export interface GameMetaDataSubscription {
  type: 'GAME/META_DATA'
}

export interface GameNotificationsSubscription {
  type: 'GAME/NOTIFICATIONS'
}
