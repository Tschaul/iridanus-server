import { Store } from "./store";
import { combineLatest, Subject } from "rxjs";
import {injectable } from 'inversify'
import { GameEvent } from "./events/event";
import { Clock } from "./infrastructure/clock";
import { GameState } from "../shared/model/v1/state";
import { map, distinctUntilChanged, take, debounceTime } from "rxjs/operators";
import { ActionLogger } from "./infrastructure/action-logger";
import { CompleteEventQueue } from "./events/complete-event-queue";
import { setTimestamp } from "./actions/set-timestamp";

@injectable()
export class Game {

  private timeout: NodeJS.Timeout | undefined;

  public gameEnded$ = new Subject<GameState>();

  constructor(
    private clock: Clock, 
    private store: Store, 
    private logger: ActionLogger,
    private completeEventQueue: CompleteEventQueue
    ) {

  }

  public startGameLoop(): Promise<GameState> {
    return new Promise<GameState>((resolve, reject) => {
      
      this.completeEventQueue.upcomingEvent$.pipe(
        distinctUntilChanged(),
        debounceTime(0),
      ).subscribe((event) => {

        if (event === null) {
          resolve(this.store.finalize() as GameState)
          return;
        }

        clearTimeout(this.timeout as NodeJS.Timeout);
        this.timeout = undefined;

        const now = this.clock.getTimestamp()

        if (now < event.timestamp) {
          this.timeout = setTimeout(() => {
            this.handleEvent(event);
          }, event.timestamp - now)

        } else {
          this.handleEvent(event);
        }
      })

      this.store.commit();
    })

  }

  private handleEvent(event: GameEvent) {
    const actions = event.happen();
    for (const action of actions) {
      this.store.dispatch(action);
      this.logger.logAction(action);
    }
    const setTimestampAction = setTimestamp(event.timestamp);
    this.store.dispatch(setTimestampAction)
    this.logger.logAction(setTimestampAction);
    this.store.commit();
  }
}