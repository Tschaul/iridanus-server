import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { World } from "../../shared/model/v1/world";
import { Observable } from "rxjs";
import equal from 'deep-equal';

@injectable()
export class WorldProjector {
  constructor(private store: ReadonlyStore) { }

  public byId$ = this.store.state$.pipe(
    map(state => state.universe.worlds),
    distinctUntilChanged(),
    shareReplay(1)
  )

  public firstByStatusAndTimestamp<TWorldWithStatus extends World>(status: TWorldWithStatus["status"], orderBy: keyof TWorldWithStatus): Observable<TWorldWithStatus | null> {
    return this.byId$.pipe(
      map(worlds => {
        const world = Object.values(worlds)
          .filter(world => world.status === status)
          .sort((a: TWorldWithStatus, b: TWorldWithStatus) => {
            return (a[orderBy] as any) - (b[orderBy] as any)
          }).find(it => !!it);
        return world as TWorldWithStatus || null;
      }),
      distinctUntilChanged(equal));
  }

  public allByStatus<TWorldWithStatus extends World>(status: TWorldWithStatus["status"]): Observable<TWorldWithStatus[]> {
    return this.byId$.pipe(
      map(worlds => {
        return Object.values(worlds).filter(world => world.status === status) as TWorldWithStatus[];
      }),
      distinctUntilChanged(equal));
  }
}