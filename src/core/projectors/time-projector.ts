import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay, startWith } from "rxjs/operators";
import { Clock } from "../infrastructure/clock";

@injectable()
export class TimeProjector {
  constructor(private store: ReadonlyStore, private clock: Clock){}

  public currentTimestampNew$ = this.store.state$.pipe(
    map(state => state.currentTimestamp),
    distinctUntilChanged(),
    shareReplay(1),
  )

  public gameEndTimestamp$ = this.store.state$.pipe(
    map(state => state.gameEndTimestamp),
    distinctUntilChanged(),
    shareReplay(1),
  )
}