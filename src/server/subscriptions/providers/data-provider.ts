import { Observable } from "rxjs";
import { Subscription } from "../../../shared/messages/subscriptions";
import { SubscriptionResult } from "../../../shared/messages/subscription-result";

export interface DataProvider {
  authenticationRequired: boolean;
  getObservable(subscription: Subscription, userId: string): Observable<SubscriptionResult>
}