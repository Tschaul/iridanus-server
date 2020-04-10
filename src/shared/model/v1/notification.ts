export type GameNotification =
  FleetAwaitingOrdersNotification
  | WorldAwaitingOrdersNotification
  | EngangingTheEnemyNotification
  | WorldIsUnderAttackNotification
  | EnemyWarpInDetectedNotification
  | NewWorldDiscoveredNotification
  | PopulationLimitReachedNotification
  | GameStartedNotification
  | GameEndedNotification;

export type PersistedGameNotification = {
  markedAsRead: boolean,
  id: string
} & GameNotification;


export interface NotificationBase {
  playerId: string,
  timestamp: number,
}

export interface GameStartedNotification extends NotificationBase {
  type: 'GAME_STARTED',
}

export interface GameEndedNotification extends NotificationBase {
  type: 'GAME_ENDED',
}

export interface FleetAwaitingOrdersNotification extends NotificationBase {
  type: 'FLEET_AWAITING_ORDERS',
  fleetId: string
  worldId: string,
}

export interface WorldAwaitingOrdersNotification extends NotificationBase {
  type: 'WORLD_AWAITING_ORDERS',
  worldId: string,
}

export interface EngangingTheEnemyNotification extends NotificationBase {
  type: 'ENGAGING_THE_ENEMY',
  fleetId: string
  worldId: string,
}

export interface WorldIsUnderAttackNotification extends NotificationBase {
  type: 'WORLD_IS_UNDER_ATTACK',
  worldId: string,
}

export interface EnemyWarpInDetectedNotification extends NotificationBase {
  type: 'ENEMY_WARP_IN_DETECTED',
  worldId: string,
}

export interface NewWorldDiscoveredNotification extends NotificationBase {
  type: 'NEW_WORLD_DISCOVERED',
  worldId: string,
}

export interface PopulationLimitReachedNotification extends NotificationBase {
  type: 'POPULATION_LIMIT_REACHED',
  worldId: string,
}

