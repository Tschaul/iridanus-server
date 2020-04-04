import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { ReadonlyStore } from "../../store";
import { switchMap, first } from "rxjs/operators";
import { EMPTY, of, Observable } from "rxjs";

@injectable()
export class GameStartsEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;
  constructor(private store: ReadonlyStore) {

    this.upcomingEvent$ = this.store.state$.pipe(
      first(),
      switchMap(state => {
        if (state.currentTimestamp < state.gameStartTimestamp) {
          const gameStartEvent: GameEvent = {
            notifications: Object.values(state.scorings).map(it => {
              return {
                type: 'GAME_STARTED',
                playerId: it.playerId,
                timestamp: state.gameStartTimestamp
              }
            }),
            timestamp: state.gameStartTimestamp,
            happen() {
              return []
            }
          }
          return of(gameStartEvent)
        } else {
          return of(null);
        }
      })
    )
  }


}