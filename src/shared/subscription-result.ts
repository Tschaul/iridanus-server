export type SubscriptionResult = GamesSubscriptionResult
  | DummySubscriptionResult;

export interface GamesSubscriptionResult {
  type: 'GAMES'
}

export interface DummySubscriptionResult {
  type: 'DUMMY_COUNTER',
  i: number
}