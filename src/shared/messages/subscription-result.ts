import { GameSubscriptionResult } from "./subscriptions/game-subscription-results";
import { EnvironmentSubscriptionResult } from "./subscriptions/environment-subscription-results";

export type SubscriptionResult = GameSubscriptionResult
  | EnvironmentSubscriptionResult;
