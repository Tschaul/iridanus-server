export type GameSubscription = GamesListAllSubscription
  | GameStateSubscription
  | GameInfoSubscription
  | GameMetaDataSubscription
  | GameNotificationsSubscription
  | GameRulesSubscription
  | GameStatsSubscription;

export interface GamesListAllSubscription {
  type: 'GAME/LIST_ALL'
}

export interface GameStateSubscription {
  type: 'GAME/STATE'
}

export interface GameStatsSubscription {
  type: 'GAME/STATS'
}

export interface GameInfoSubscription {
  type: 'GAME/INFO'
}

export interface GameRulesSubscription {
  type: 'GAME/RULES'
}

export interface GameMetaDataSubscription {
  type: 'GAME/META_DATA'
}

export interface GameNotificationsSubscription {
  type: 'GAME/NOTIFICATIONS'
}
