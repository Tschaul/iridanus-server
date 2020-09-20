import { Store } from "./store";
import { combineLatest, Subject, interval, concat, EMPTY } from "rxjs";
import { injectable } from 'inversify'
import { GameEvent } from "./events/event";
import { Clock } from "./infrastructure/clock";
import { GameState } from "../shared/model/v1/state";
import { distinctUntilChanged, debounceTime, takeUntil } from "rxjs/operators";
import { CompleteEventQueue } from "./events/complete-event-queue";
import { GameSetupProvider } from "./game-setup-provider";
import { NotificationHandler } from "./infrastructure/notification-handler";
import { GameStartsEventQueue } from "./events/start/game-starts";

@injectable()
export class Game {

  private timeout: NodeJS.Timeout | undefined;

  public gameEnded$ = new Subject<GameState>();

  constructor(
    private clock: Clock,
    private store: Store,
    private completeEventQueue: CompleteEventQueue,
    private setup: GameSetupProvider,
    private notificationHandler: NotificationHandler,
    private gameStarts: GameStartsEventQueue
  ) {

  }

  public async startGameLoop() {
    const gameStartEvent = await this.gameStarts.upcomingEvent$.toPromise();
    const now = this.clock.getTimestamp()
    if (gameStartEvent != null && now < gameStartEvent.timestamp!) {
      await new Promise((resolve) => {
        setTimeout(() => {
          this.handleEvent(gameStartEvent, gameStartEvent.timestamp!, resolve);
          resolve();
        }, gameStartEvent.timestamp! - now)
      })
    }
    return await this.startMainGameLoop();
  }

  private startMainGameLoop(): Promise<GameState> {
    return new Promise<GameState>((resolve, reject) => {

      concat(this.gameStarts.upcomingEvent$, this.completeEventQueue.upcomingEvent$).pipe(
        distinctUntilChanged(),
        debounceTime(0),
        takeUntil(this.store.finalized$)
      ).subscribe((event) => {

        if (event == null) {
          if (this.setup.endGameLoopWhenNoEventIsQueued) {
            this.finalizeAndResolve(resolve)
            return
          }
          return;
        }

        clearTimeout(this.timeout as NodeJS.Timeout);
        this.timeout = undefined;


        if (this.setup.awaitClock) {
          const now = this.clock.getTimestamp()
          if (event.timestamp && now < event.timestamp) {
            this.timeout = setTimeout(() => {
              this.handleEvent(event, event.timestamp!, resolve);
            }, event.timestamp - now)
          } else {
            this.handleEvent(event, event.timestamp ?? this.store.currentTimestamp, resolve);
          }
        } else {
          this.handleEvent(event, event.timestamp ?? this.store.currentTimestamp, resolve);
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

  private handleEvent(event: GameEvent, timestamp: number, resolve: (state: GameState) => void) {
    const actions = event.happen(timestamp);
    for (const action of actions) {
      this.store.dispatch(action);
    }
    this.store.commit(timestamp);
    this.notificationHandler.handleNotifications(event, timestamp);
    if (event.endsGame) {
      this.finalizeAndResolve(resolve);
    }
  }
}