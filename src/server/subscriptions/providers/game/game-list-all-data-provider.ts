import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { GameRepository } from "../../../repositories/games/games-repository";
import { GamesListAllSubscription } from "../../../../shared/messages/subscriptions/game-subscriptions";
import { GameListAllSubscriptionResult } from "../../../../shared/messages/subscriptions/game-subscription-results";

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