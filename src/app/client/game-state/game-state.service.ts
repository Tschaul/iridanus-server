import { SocketConnection } from "../socket-connection";
import { injectable } from "inversify";
import { GameStateSubscription, GameInfoSubscription } from "../../../shared/messages/subscriptions";
import { GameStateSubscriptionResult, GameInfoSubscriptionResult } from "../../../shared/messages/subscription-result";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { GameState } from "../../../shared/model/v1/state";
import { GameInfo } from "../../../shared/model/v1/game-info";

@injectable()
export class GameStateService {

  constructor(
    private connection: SocketConnection
    ) {}
  
  getGameStateById(gameId: string) {
    return  this.connection.subscribe<GameStateSubscription, GameStateSubscriptionResult>({
      type: 'GAME/STATE'
    }, gameId).pipe(
      map(result => result.state)
    ) as Observable<GameState>
  }

  getGameInfoById(gameId: string) {
    return  this.connection.subscribe<GameInfoSubscription, GameInfoSubscriptionResult>({
      type: 'GAME/INFO'
    }, gameId).pipe(
      map(result => result.info)
    ) as Observable<GameInfo>
  }
}