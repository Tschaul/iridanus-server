import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";

@injectable()
export class PlayerProjector {
  constructor(private store: ReadonlyStore) { }

  public allPlayerIds$ = this.store.state$.pipe(
    map(state => Object.getOwnPropertyNames(state.players)),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public byId$ = this.store.state$.pipe(
    map(state => state.players),
    distinctUntilChanged(),
    shareReplay(1)
  );
}