import { Store } from "./store";
import { combineLatest, Subject, interval } from "rxjs";
import { injectable } from 'inversify'
import { GameEvent } from "./events/event";
import { Clock } from "./infrastructure/clock";
import { GameState } from "../shared/model/v1/state";
import { distinctUntilChanged, debounceTime, takeUntil } from "rxjs/operators";
import { CompleteEventQueue } from "./events/complete-event-queue";
import { GameSetupProvider } from "./game-setup-provider";
import { NotificationHandler } from "./infrastructure/notification-handler";

@injectable()
export class Game {

  private timeout: NodeJS.Timeout | undefined;

  public gameEnded$ = new Subject<GameState>();

  constructor(
    private clock: Clock,
    private store: Store,
    private completeEventQueue: CompleteEventQueue,
    private setup: GameSetupProvider,
    private notificationHandler: NotificationHandler
  ) {

  }

  public startGameLoop(): Promise<GameState> {
    return new Promise<GameState>((resolve, reject) => {

      this.completeEventQueue.upcomingEvent$.pipe(
        distinctUntilChanged(),
        debounceTime(0),
        takeUntil(this.store.finalized$)
      ).subscribe((event) => {

        if (event === null) {
          if (this.setup.endGameLoopWhenNoEventIsQueued) {
            this.finalizeAndResolve(resolve)
            return
          }
          return;
        }

        clearTimeout(this.timeout as NodeJS.Timeout);
        this.timeout = undefined;

        const now = this.clock.getTimestamp()

        if (now < event.timestamp && this.setup.awaitClock) {
          this.timeout = setTimeout(() => {
            this.handleEvent(event, resolve);
          }, event.timestamp - now)
        } else {
          this.handleEvent(event, resolve);
        }

        if (event.endsGame) {
          return
        }
      })

      this.store.commit(this.clock.getTimestamp());
    })

  }

  private finalizeAndResolve(resolve: (state: GameState) => void) {
    resolve(this.store.finalize() as GameState)
  }

  private handleEvent(event: GameEvent, resolve: (state: GameState) => void) {
    const actions = event.happen();
    for (const action of actions) {
      this.store.dispatch(action);
    }
    this.store.commit(event.timestamp);
    this.notificationHandler.handleNotifications(event);
    if (event.endsGame) {
      this.finalizeAndResolve(resolve);
    }
  }
}