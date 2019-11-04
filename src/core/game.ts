import { Store } from "./store";
import { Observable, combineLatest, Subject } from "rxjs";
import { GameEvent } from "./events/event";
import { Clock } from "./clock";
import { State } from "./state";
import { SetTimestampAction } from "./actions/set-timestamp";
import { map, distinctUntilChanged, take } from "rxjs/operators";
import { upcomingLeaveEvent } from "./events/warping/leave-world";
import { upcomingEndWarpEvent } from "./events/warping/end-warp";
import { upcomingBeginWarpEvent } from "./events/warping/begin-warp";
import { upcomingArriveWorldEvent } from "./events/warping/arrive-world";
import { upcomingBeginTransferMetalEvent } from "./events/transfer/begin-transfer-metal";
import { upcomingEndTransferMetalEvent } from "./events/transfer/end-transfer-metal";

export class Game {

  private store: Store;
  private timeout: number | undefined;
  private gameEndTimestamp: number;

  public gameEnded$ = new Subject<State>();


  constructor(private clock: Clock, worldMap: State) {

    this.gameEndTimestamp =worldMap.gameEndTimestamp;

    this.store = new Store(worldMap)

    const nextEvent$ = combineLatest(
      // upcomingTickEvent(this.store.state$),
      upcomingLeaveEvent(this.store.state$),
      upcomingBeginWarpEvent(this.store.state$),
      upcomingEndWarpEvent(this.store.state$),
      upcomingArriveWorldEvent(this.store.state$),
      upcomingBeginTransferMetalEvent(this.store.state$),
      upcomingEndTransferMetalEvent(this.store.state$),

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
      })
    )

    nextEvent$.pipe(
      distinctUntilChanged(),
    ).subscribe((event) => {

      if (event === null || event.timestamp > this.gameEndTimestamp) {
        this.store.state$.pipe(take(1)).subscribe(
          state => this.gameEnded$.next(state)
        )
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
  }

  private handleEvent(event: GameEvent) {
    const actions = event.happen();
    for (const action of actions) {
      this.store.dispatch(action);
    }
    this.store.dispatch(new SetTimestampAction(event.timestamp))
    this.store.commit();
  }
}