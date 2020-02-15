import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { GameInfoSubscription } from "../../../../shared/messages/subscriptions";
import { GameInfoSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { GameSetupProvider } from "../../../../core/game-setup-provider";
import { GameRepository } from "../../../repositories/games/games-repository";

@injectable()
export class GameInfoDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private repository: GameRepository,
    private setup: GameSetupProvider
    ){}

  getObservable(subscription: GameInfoSubscription): Observable<GameInfoSubscriptionResult> {
    return this.repository.getGameInfoByIdAsObservable(this.setup.gameId).pipe(
      map(info => {
        return {
          type: 'GAME/INFO',
          info
        }
      })
    )
  }
}