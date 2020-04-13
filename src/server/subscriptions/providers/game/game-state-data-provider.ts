import { Observable, from, EMPTY } from "rxjs";
import { injectable } from "inversify";
import { map, switchMap, first } from "rxjs/operators";
import { DataProvider } from "../data-provider";
import { VisibilityProjector } from "../../../../core/projectors/visibility-projector";
import { GameStateSubscription } from "../../../../shared/messages/subscriptions/game-subscriptions";
import { GameStateSubscriptionResult } from "../../../../shared/messages/subscriptions/game-subscription-results";
import { ReadonlyStore } from "../../../../core/store";
import { GameRepository } from "../../../repositories/games/games-repository";
import { GameSetupProvider } from "../../../../core/game-setup-provider";

@injectable()
export class GameStateDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private visibility: VisibilityProjector,
    private store: ReadonlyStore,
    private gameRepository: GameRepository,
    private setup: GameSetupProvider
  ){}

  getObservable(subscription: GameStateSubscription, playerId: string): Observable<GameStateSubscriptionResult> {

    return this.gameRepository.getGameInfoByIdAsObservable(this.setup.gameId).pipe(
      first(),
      switchMap(gameInfo => {

        if (gameInfo.state === 'PROPOSED') {
          return EMPTY;
        }

        const playerInfo = gameInfo.players[playerId];

        if (!playerInfo) {
          return EMPTY;
        }

        if (playerInfo.isSpectator) {
          return this.store.state$.pipe(
            map(state => {
              return {
                type: 'GAME/STATE' as 'GAME/STATE',
                state
              }
            })
          );
        }

        return this.visibility.visibleUniverseForPlayer(playerId).pipe(
          map(state => {
            return {
              type: 'GAME/STATE' as 'GAME/STATE',
              state
            }
          })
        ) 
      })
    )
  }
}