import { Observable, of } from "rxjs";
import { injectable } from "inversify";
import { DataProvider } from "../data-provider";
import { Environment } from "../../../environment/environment";
import { EnvironmentInfoSubscription } from "../../../../shared/messages/subscriptions/environment-subscriptions";
import { EnvironmentInfoSubscriptionResult } from "../../../../shared/messages/subscriptions/environment-subscription-results";

@injectable()
export class EnvironmentInfoDataProvider implements DataProvider {
  authenticationRequired = false;

  constructor(
    private environment: Environment,
  ) { }

  getObservable(subscription: EnvironmentInfoSubscription): Observable<EnvironmentInfoSubscriptionResult> {
    return of({
      type: 'ENVIRONMENT/INFO',
      info: {
        millisecondsPerDay: this.environment.millisecondsPerDay,
        developmentMode: this.environment.developmentMode,
        telegramBotName: this.environment.telegramBotName
      }
    })
  }
}