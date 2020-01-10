import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { MapListFinalSubscription } from "../../../../shared/messages/subscriptions";
import { MapListFinalSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { MapRepository } from "../../../repositories/maps/map-repository";

@injectable()
export class MapListFinalDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(private repository: MapRepository){}

  getObservable(subscription: MapListFinalSubscription): Observable<MapListFinalSubscriptionResult> {
    return this.repository.allMapAsObservable().pipe(
      map(maps => {
        return {
          type: 'MAP/LIST_FINAL',
          maps: maps.filter(map => map.final)
        }
      })
    )
  }
}