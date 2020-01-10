import { injectable } from "inversify";
import { Subscription } from "../../shared/messages/subscriptions";
import { Observable, Subject, interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ContainerRegistry } from "../container-registry";
import { DataProvider } from "./providers/data-provider";
import { ResponseMessage } from "../../shared/messages/response-message";
import { getGameSetupDataProvider } from "./providers/game-setup/game-setup-data-provider-registry";

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
  ) {

    if (this.activeSubscriptions.has(id)) {
      sendfn({
        type: 'ERROR',
        error: 'Subscription id is allready in use'
      })
      return;
    }

    const cancelSubject = new Subject<never>();

    const dataProvider = this.getDataProvider(registry, subcription, gameId);

    if (dataProvider.authenticationRequired && userId == null) {
      sendfn({
        type: 'ERROR',
        error: 'Authentication required'
      })
      return;
    }

    dataProvider.getObservable(subcription).pipe(takeUntil(cancelSubject)).subscribe(data => {
      const response: ResponseMessage = {
        type: 'SUBSCRIPTION_RESULT',
        id,
        result: data
      }
      sendfn(response)
    })

    this.activeSubscriptions.set(id, cancelSubject);
  }

  public cancelSubscription(id: string) {
    const cancelSubject = this.activeSubscriptions.get(id) as Subject<never>;
    cancelSubject.next();
    cancelSubject.complete();
    this.activeSubscriptions.delete(id);
  }

  private getDataProvider(registry: ContainerRegistry, subscription: Subscription, gameId: string | null | undefined): DataProvider {
    const container = registry.getContainerByGameId(gameId);

    const firstPart = subscription.type.split('/')[0];

    switch (firstPart) {
      case 'GAME':
        return getGameSetupDataProvider(registry, subscription, gameId);
    }

    throw new Error('unhandled case ' + subscription.type)
  }
}