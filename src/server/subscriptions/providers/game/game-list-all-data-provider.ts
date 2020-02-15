import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { GamesListAllSubscription } from "../../../../shared/messages/subscriptions";
import { GameListAllSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { GameRepository } from "../../../repositories/games/games-repository";

@injectable()
export class GameListAllDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(private repository: GameRepository){}

  getObservable(subscription: GamesListAllSubscription): Observable<GameListAllSubscriptionResult> {
    return this.repository.allGameInfosAsObservable().pipe(
      map(games => {
        return {
          type: 'GAME/LIST_ALL',
          games
        }
      })
    )
  }
}