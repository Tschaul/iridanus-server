import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";

@injectable()
export class GatesProjector {
  constructor(private store: ReadonlyStore) { }

  public all$ = this.store.state$.pipe(
    map(state => state.universe.gates),
    distinctUntilChanged(),
    shareReplay(1)
  );
}