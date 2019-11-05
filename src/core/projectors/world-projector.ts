import { injectable } from "inversify";
import 'reflect-metadata'
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";

@injectable()
export class WorldProjector {
  constructor(private store: ReadonlyStore){}

  public byId$ = this.store.state$.pipe(
    map(state => state.universe.worlds),
    distinctUntilChanged(),
    shareReplay(1)
  )
}