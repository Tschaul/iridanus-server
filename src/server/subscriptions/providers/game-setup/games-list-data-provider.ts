import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { GamesListSubscription } from "../../../../shared/messages/subscriptions";
import { GamesSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { GamesRepository } from "../../../repositories/games/games-repository";

@injectable()
export class GamesListDataProvider implements DataProvider {

  constructor(private repository: GamesRepository){}

  getObservable(subscription: GamesListSubscription): Observable<GamesSubscriptionResult> {
    return this.repository.allGameInfosAsObservable().pipe(
      map(games => {
        return {
          type: 'GAME/LIST',
          games
        }
      })
    )
  }
}