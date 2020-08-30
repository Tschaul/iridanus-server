import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";

@injectable()
export class PlayerProjector {
  constructor(private store: ReadonlyStore) { }

  public allPlayerIds$ = this.store.state$.pipe(
    map(state => Object.getOwnPropertyNames(state.scorings)),
    distinctUntilChanged(),
    shareReplay(1)
  );
}