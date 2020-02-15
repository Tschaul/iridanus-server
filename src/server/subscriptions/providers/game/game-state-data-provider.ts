import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { GameStateSubscription } from "../../../../shared/messages/subscriptions";
import { GameStateSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { ReadonlyStore } from "../../../../core/store";

@injectable()
export class GameStateDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(private store: ReadonlyStore){}

  getObservable(subscription: GameStateSubscription): Observable<GameStateSubscriptionResult> {
    return this.store.state$.pipe(
      map(state => {
        return {
          type: 'GAME/STATE',
          state
        }
      })
    )
  }
}