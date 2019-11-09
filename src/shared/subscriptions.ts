export type Subscription = GamesSubscription
  | DummySubscription;

export interface GamesSubscription {
  type: 'GAMES'
}

export interface DummySubscription {
  type: 'DUMMY_COUNTER'
}