import { Observable } from "rxjs";
import { injectable } from "inversify";
import { DataProvider } from "../data-provider";
import { RulesListAllSubscription } from "../../../../shared/messages/subscriptions";
import { RulesListAllSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { RulesRepository } from "../../../repositories/rules/rules-repository";
import { map } from "rxjs/operators";

@injectable()
export class RulesListAllDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(private repository: RulesRepository){}

  getObservable(subscription: RulesListAllSubscription): Observable<RulesListAllSubscriptionResult> {
    return this.repository.allRulesAsObservable().pipe(
      map(rules => {
        return {
          type: 'RULES/LIST_ALL',
          rules
        }
      })
    )
  }
}