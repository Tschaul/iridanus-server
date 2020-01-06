export type Subscription = GamesListSubscription
  | DummySubscription;

export interface GamesListSubscription {
  type: 'GAME/LIST'
}

export interface DummySubscription {
  type: 'DUMMY_COUNTER'
}