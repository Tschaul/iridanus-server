import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { VisibilityProjector } from "../../../../core/projectors/visibility-projector";
import { GameStateSubscription } from "../../../../shared/messages/subscriptions/game-subscriptions";
import { GameStateSubscriptionResult } from "../../../../shared/messages/subscriptions/game-subscription-results";

@injectable()
export class GameStateDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private visibility: VisibilityProjector
  ){}

  getObservable(subscription: GameStateSubscription, playerId: string): Observable<GameStateSubscriptionResult> {
    return this.visibility.visibleUniverseForPlayer(playerId).pipe(
      map(state => {
        return {
          type: 'GAME/STATE',
          state
        }
      })
    )
  }
}