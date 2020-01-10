import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { MapListAllSubscription } from "../../../../shared/messages/subscriptions";
import { MapListAllSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { MapRepository } from "../../../repositories/maps/map-repository";

@injectable()
export class MapListAllDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(private repository: MapRepository){}

  getObservable(subscription: MapListAllSubscription): Observable<MapListAllSubscriptionResult> {
    return this.repository.allMapAsObservable().pipe(
      map(maps => {
        return {
          type: 'MAP/LIST_ALL',
          maps
        }
      })
    )
  }
}