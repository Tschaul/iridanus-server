import { GameSubscription } from "./subscriptions/game-subscriptions";
import { EnvironmentSubscription } from "./subscriptions/environment-subscriptions";
import { UserInfoSubscription } from "./subscriptions/user-subscriptions";

export type Subscription = GameSubscription
  | EnvironmentSubscription
  | UserInfoSubscription;
