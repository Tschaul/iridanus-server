import { injectable } from "inversify";
import 'reflect-metadata'
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";

@injectable()
export class TimeProjector {
  constructor(private store: ReadonlyStore){}

  public currentTimestamp$ = this.store.state$.pipe(
    map(state => state.currentTimestamp),
    distinctUntilChanged(),
    shareReplay(1)
  )
}