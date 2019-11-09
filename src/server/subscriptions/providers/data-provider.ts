import { Observable } from "rxjs";
import { Subscription } from "../../../shared/subscriptions";
import { SubscriptionResult } from "../../../shared/subscription-result";

export interface DataProvider {
  getObservable(subscription: Subscription): Observable<SubscriptionResult>
}