import { Observable, of } from "rxjs";
import { injectable } from "inversify";
import { DataProvider } from "../data-provider";
import { GameSetupProvider } from "../../../../core/game-setup-provider";
import { GameRulesSubscription } from "../../../../shared/messages/subscriptions/game-subscriptions";
import { GameRulesSubscriptionResult } from "../../../../shared/messages/subscriptions/game-subscription-results";

@injectable()
export class GameRulesDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private setup: GameSetupProvider
  ) { }

  getObservable(subscription: GameRulesSubscription): Observable<GameRulesSubscriptionResult> {
    return of({
      type: 'GAME/RULES',
      rules: this.setup.rules
    })
  }
}