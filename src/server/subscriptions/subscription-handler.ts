import { injectable } from "inversify";
import { Subscription } from "../../shared/messages/subscriptions";
import { Observable, Subject, interval, race } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ContainerRegistry } from "../container-registry";
import { DataProvider } from "./providers/data-provider";
import { ResponseMessage } from "../../shared/messages/response-message";
import { getGameSetupDataProvider } from "./providers/game-setup/game-setup-data-provider-registry";
import { getMapDataProvider } from "./providers/maps/maps-data-provider-registry";
import { getRulesDataProvider } from "./providers/rules/rules-data-provider-registry";

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

    dataProvider.getObservable(subcription).pipe(takeUntil(race(cancelSubject$$, connectionClosed$))).subscribe(data => {
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
        return getGameSetupDataProvider(registry, subscription, gameId);
      case 'MAP':
        return getMapDataProvider(registry, subscription, gameId);
      case 'RULES':
        return getRulesDataProvider(registry, subscription, gameId);
    }

    throw new Error('unhandled case ' + subscription.type)
  }
}