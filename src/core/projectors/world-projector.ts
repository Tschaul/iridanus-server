import { injectable } from "inversify";
import 'reflect-metadata'
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { World } from "../model/world";
import { WorldOrder } from "../model/world-order";
import { Observable } from "rxjs";

@injectable()
export class WorldProjector {
  constructor(private store: ReadonlyStore){}

  public byId$ = this.store.state$.pipe(
    map(state => state.universe.worlds),
    distinctUntilChanged(),
    shareReplay(1)
  )

  public firstByStatusAndNextOrderType<TWorldWithStatus extends World, TWorldOrder extends WorldOrder>(
    status: TWorldWithStatus["status"], 
    orderType: WorldOrder["type"]): Observable<[TWorldWithStatus | null, TWorldOrder | null]> {
    return this.byId$.pipe(
      map(Worlds => {
        const world = Object.values(Worlds).find(World => World.status === status
          && World.orders.length
          && World.orders[0].type === orderType);
        return [world || null, world ? world.orders[0] : null] as any;
      }),
      distinctUntilChanged());
    
  }

  public firstByStatus<TWorldWithStatus extends World>(status: World["status"]): Observable<TWorldWithStatus | null> {
    return this.byId$.pipe(
      map(worlds => {
        const world = Object.values(worlds).find(world => world.status === status);
        return world as TWorldWithStatus || null;
      }),
      distinctUntilChanged());
  }
}