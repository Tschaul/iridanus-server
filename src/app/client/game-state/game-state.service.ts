import { SocketConnection } from "../socket-connection";
import { injectable } from "inversify";
import { GameStateSubscription, GameInfoSubscription, GameMetaDataSubscription } from "../../../shared/messages/subscriptions";
import { GameStateSubscriptionResult, GameInfoSubscriptionResult, GameMetaDataSubscriptionResult } from "../../../shared/messages/subscription-result";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { GameState } from "../../../shared/model/v1/state";
import { GameInfo, GameMetaData } from "../../../shared/model/v1/game-info";
import { VisibleState } from "../../../shared/model/v1/visible-state";

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
    ) as Observable<VisibleState>
  }

  getGameInfoById(gameId: string) {
    return  this.connection.subscribe<GameInfoSubscription, GameInfoSubscriptionResult>({
      type: 'GAME/INFO'
    }, gameId).pipe(
      map(result => result.info)
    ) as Observable<GameInfo>
  }

  getGameMetaDataById(gameId: string) {
    return  this.connection.subscribe<GameMetaDataSubscription, GameMetaDataSubscriptionResult>({
      type: 'GAME/META_DATA'
    }, gameId).pipe(
      map(result => result.data)
    ) as Observable<GameMetaData>
  }
}