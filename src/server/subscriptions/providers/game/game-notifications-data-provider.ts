import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { GameNotificationsSubscription } from "../../../../shared/messages/subscriptions";
import { GameNotificationsSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { GameSetupProvider } from "../../../../core/game-setup-provider";
import { GameRepository } from "../../../repositories/games/games-repository";

@injectable()
export class GameNotificationsDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private repository: GameRepository,
    private setup: GameSetupProvider
  ) { }

  getObservable(subscription: GameNotificationsSubscription, playerId: string): Observable<GameNotificationsSubscriptionResult> {
    return this.repository.getGameNotificationsByIdAsObservable(this.setup.gameId).pipe(
      map(notifications => {
        return {
          type: 'GAME/NOTIFICATIONS',
          notifications: notifications[playerId] || []
        }
      })
    )
  }
}