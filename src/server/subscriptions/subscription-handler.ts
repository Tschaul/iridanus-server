import { injectable } from "inversify";
import { Subscription } from "../../shared/subscriptions";
import { Observable, Subject, interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ContainerRegistry } from "../container-registry";
import { CounterDataProvider } from "./providers/counter-data-provider";
import { DataProvider } from "./providers/data-provider";
import { ResponseMessage } from "../../shared/response-message";

@injectable()
export class SubscriptionHandler {

  private activeSubscriptions = new Map<string, Observable<never>>()

  constructor() { }

  public newSubscription(
    registry: ContainerRegistry,
    subcription: Subscription, 
    id: string, 
    gameId: string | null | undefined,
    sendfn: (data: Object) => void, 
  ) {

    if (this.activeSubscriptions.has(id)) {
      return; // TODO send error
    }

    const cancelSubject = new Subject<never>();

    const dataProvider = this.getDataProvider(registry, subcription, gameId);

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
    switch (subscription.type) {
      case 'DUMMY_COUNTER':
        return container.get(CounterDataProvider) as DataProvider
    }

    throw new Error('unhandled case ' + subscription.type)
  }
}