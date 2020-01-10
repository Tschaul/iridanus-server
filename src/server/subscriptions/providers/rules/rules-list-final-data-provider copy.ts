import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { RulesListFinalSubscription } from "../../../../shared/messages/subscriptions";
import { RulesListFinalSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { RulesRepository } from "../../../repositories/rules/rules-repository";

@injectable()
export class RulesListFinalDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(private repository: RulesRepository){}

  getObservable(subscription: RulesListFinalSubscription): Observable<RulesListFinalSubscriptionResult> {
    return this.repository.allRulesAsObservable().pipe(
      map(rules => {
        return {
          type: 'RULES/LIST_FINAL',
          rules: rules.filter(map => map.final)
        }
      })
    )
  }
}