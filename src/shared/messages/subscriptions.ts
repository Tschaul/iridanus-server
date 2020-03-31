import { GameSubscription } from "./subscriptions/game-subscriptions";
import { EnvironmentSubscription } from "./subscriptions/environment-subscriptions";

export type Subscription = GameSubscription
  | EnvironmentSubscription;
