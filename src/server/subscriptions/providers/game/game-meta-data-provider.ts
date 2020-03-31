import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { GameSetupProvider } from "../../../../core/game-setup-provider";
import { GameRepository } from "../../../repositories/games/games-repository";
import { GameMetaDataSubscription } from "../../../../shared/messages/subscriptions/game-subscriptions";
import { GameMetaDataSubscriptionResult } from "../../../../shared/messages/subscriptions/game-subscription-results";

@injectable()
export class GameMetaDataDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private repository: GameRepository,
    private setup: GameSetupProvider
    ){}

  getObservable(subscription: GameMetaDataSubscription): Observable<GameMetaDataSubscriptionResult> {
    return this.repository.getGameMetaDataByIdAsObservable(this.setup.gameId).pipe(
      map(data => {
        return {
          type: 'GAME/META_DATA',
          data
        }
      })
    )
  }
}