import { injectable } from "inversify";
import { Subscription } from "../../shared/messages/subscriptions";
import { Observable, Subject, interval, race } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ContainerRegistry } from "../container-registry";
import { DataProvider } from "./providers/data-provider";
import { ResponseMessage } from "../../shared/messages/response-message";
import { getGameDataProvider } from "./providers/game/game-data-provider-registry";
import { GameSubscription } from "../../shared/messages/subscriptions/game-subscriptions";
import { getEnvironmentDataProvider } from "./providers/environment/environment-data-provider-registry";
import { EnvironmentSubscription } from "../../shared/messages/subscriptions/environment-subscriptions";
import { getUserInfoDataProvider } from "./providers/user/user-data-provider-registry";
import { UserInfoSubscription } from "../../shared/messages/subscriptions/user-subscriptions";

@injectable()
export class SubscriptionHandler {

  private activeSubscriptions = new Map<string, Observable<never>>()

  constructor() { }

  public newSubscription(
    registry: ContainerRegistry,
    subcription: Subscription,
    id: string,
    gameId: string | null | undefined,
    userId: string | null,
    sendfn: (data: ResponseMessage) => void,
    connectionClosed$: Observable<never>
  ) {

    if (this.activeSubscriptions.has(id)) {
      sendfn({
        type: 'ERROR',
        error: 'Subscription id is allready in use'
      })
      return;
    }

    const cancelSubject$$ = new Subject<never>();

    const dataProvider = this.getDataProvider(registry, subcription, gameId);

    if (dataProvider.authenticationRequired && userId == null) {
      sendfn({
        type: 'ERROR',
        error: 'Authentication required'
      })
      return;
    }

    dataProvider.getObservable(subcription, userId as string).pipe(takeUntil(race(cancelSubject$$, connectionClosed$))).subscribe(data => {
      const response: ResponseMessage = {
        type: 'SUBSCRIPTION_RESULT',
        id,
        result: data
      }
      sendfn(response)
    })

    this.activeSubscriptions.set(id, cancelSubject$$);
  }

  public cancelSubscription(id: string) {
    const cancelSubject = this.activeSubscriptions.get(id) as Subject<never>;
    cancelSubject.next();
    cancelSubject.complete();
    this.activeSubscriptions.delete(id);
  }

  private getDataProvider(registry: ContainerRegistry, subscription: Subscription, gameId: string | null | undefined): DataProvider {

    const firstPart = subscription.type.split('/')[0];

    switch (firstPart) {
      case 'GAME':
        return getGameDataProvider(registry, subscription as GameSubscription, gameId);
      case 'ENVIRONMENT':
        return getEnvironmentDataProvider(registry, subscription as EnvironmentSubscription);
      case 'USER':
        return getUserInfoDataProvider(registry, subscription as UserInfoSubscription);
    }

    throw new Error('unhandled case ' + subscription.type)
  }
}