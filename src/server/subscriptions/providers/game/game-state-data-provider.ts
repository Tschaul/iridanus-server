import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { GameStateSubscription } from "../../../../shared/messages/subscriptions";
import { GameStateSubscriptionResult } from "../../../../shared/messages/subscription-result";
import { VisibilityProjector } from "../../../../core/projectors/visibility-projector";

@injectable()
export class GameStateDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private visibility: VisibilityProjector
  ){}

  getObservable(subscription: GameStateSubscription, playerId: string): Observable<GameStateSubscriptionResult> {
    console.log('GameStateDataProvider.getObservable')
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