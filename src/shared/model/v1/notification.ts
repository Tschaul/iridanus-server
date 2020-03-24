export type GameNotification =
  FleetAwaitingOrdersNotification
  | WorldAwaitingOrdersNotification
  | EngangingTheEnemyNotification
  | WorldIsUnderAttackNotification
  | EnemyWarpInDetectedNotification
  | NewWorldDiscoveredNotification
  | PopulationLimitReachedNotification;

 export type PersistedGameNotification = {
   markedAsRead: boolean,
   id: string
 } & GameNotification;


export interface NotificationBase {
  playerId: string,
  worldId: string,
  timestamp: number,
}

export interface FleetAwaitingOrdersNotification extends NotificationBase {
  type: 'FLEET_AWAITING_ORDERS',
  fleetId: string
}

export interface WorldAwaitingOrdersNotification extends NotificationBase {
  type: 'WORLD_AWAITING_ORDERS',
  fleetId: string
}

export interface EngangingTheEnemyNotification extends NotificationBase {
  type: 'ENGAGING_THE_ENEMY',
  fleetId: string
}

export interface WorldIsUnderAttackNotification extends NotificationBase {
  type: 'WORLD_IS_UNDER_ATTACK',
}

export interface EnemyWarpInDetectedNotification extends NotificationBase {
  type: 'ENEMY_WARP_IN_DETECTED',
}

export interface NewWorldDiscoveredNotification extends NotificationBase {
  type: 'NEW_WORLD_DISCOVERED',
}

export interface PopulationLimitReachedNotification extends NotificationBase {
  type: 'POPULATION_LIMIT_REACHED',
}

