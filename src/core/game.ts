import { Store } from "./store";
import { combineLatest, Subject } from "rxjs";
import {injectable } from 'inversify'
import 'reflect-metadata';
import { GameEvent } from "./events/event";
import { Clock } from "./infrastructure/clock";
import { State } from "./state";
import { SetTimestampAction } from "./actions/set-timestamp";
import { map, distinctUntilChanged, take, debounceTime } from "rxjs/operators";
import { Logger } from "./infrastructure/logger";
import { CompleteEventQueue } from "./events/complete-event-queue";

@injectable()
export class Game {

  private timeout: number | undefined;

  public gameEnded$ = new Subject<State>();

  constructor(
    private clock: Clock, 
    private store: Store, 
    private logger: Logger,
    private completeEventQueue: CompleteEventQueue
    ) {

  }

  public startGameLoop(): Promise<State> {
    return new Promise<State>((resolve, reject) => {
      const nextEvent$ = combineLatest(
        this.completeEventQueue.upcomingEvent$,
      ).pipe(
        map((events) => {
          return events.reduce((acc, event) => {
            if (event === null) {
              return acc;
            } else if (acc === null) {
              return event;
            } else if (event.timestamp < acc.timestamp) {
              return event;
            } else {
              return acc;
            }
          }, null as GameEvent | null)
        }),
      )

      nextEvent$.pipe(
        distinctUntilChanged(),
        debounceTime(0),
      ).subscribe((event) => {

        if (event === null) {
          resolve(this.store.finalize() as State)
          return;
        }

        clearTimeout(this.timeout);
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
      this.logger.log(action);
    }
    this.store.dispatch(new SetTimestampAction(event.timestamp))
    this.logger.log("new timestamp: "+event.timestamp);
    this.store.commit();
  }
}