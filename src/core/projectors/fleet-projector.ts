import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";
import { Fleet, fleetIsAtWorld } from "../../shared/model/v1/fleet";
import { FleetOrder } from "../../shared/model/v1/fleet-orders";
import equal from 'deep-equal';

@injectable()
export class FleetProjector {

  constructor(private store: ReadonlyStore) { }

  public byId$ = this.store.state$.pipe(
    map(state => state.universe.fleets),
    distinctUntilChanged(),
    shareReplay(1)
  ) as Observable<{ [k: string]: Fleet }>

  public byCurrentWorldId$ = this.byId$.pipe(
    map(fleetsById => {
      const result = {} as { [k: string]: Fleet[] };

      for (const fleet of Object.values(fleetsById)) {
        if (fleetIsAtWorld(fleet)) {
          if (!result[fleet.currentWorldId]) {
            result[fleet.currentWorldId] = [];
          }
          result[fleet.currentWorldId].push(fleet);
        }
      }

      return result;
    }),
    shareReplay(1),
    distinctUntilChanged(equal)
  ) as Observable<{ [k: string]: Fleet[] }>;

  public allByStatus<TFleetWithStatus extends Fleet,>(
    status: TFleetWithStatus["status"]): Observable<TFleetWithStatus[]> {
      return this.byId$.pipe(
        map(fleetsById => {
          return Object.values(fleetsById).filter(fleet =>
            fleet.status === status) as TFleetWithStatus[];
        }),
        shareReplay(1)
      );
  }

  public firstByStatusAndNextOrderType<TFleetWithStatus extends Fleet, TFleetOrder extends FleetOrder>(
    status: TFleetWithStatus["status"],
    orderType: TFleetOrder["type"]): Observable<[TFleetWithStatus | null, TFleetOrder | null]> {
    return this.allByStatusAndNextOrderType(status, orderType).pipe(
      map(fleets => {
        const fleet = fleets.length ? fleets[0] : null;
        return [fleet || null, fleet ? (fleet.orders[0] || null) : null] as any;
      }),
      shareReplay(1)
    )
  }

  public allByStatusAndNextOrderType<TFleetWithStatus extends Fleet, TFleetOrder extends FleetOrder>(
    status: TFleetWithStatus["status"],
    orderType: TFleetOrder["type"]): Observable<TFleetWithStatus[]> {
    return this.byId$.pipe(
      map(fleetsById => {
        return Object.values(fleetsById).filter(fleet =>
          fleet.status === status
          && fleet.orders.length
          && fleet.orders[0].type === orderType) as TFleetWithStatus[];
      }),
      shareReplay(1)
    );
  }

  public firstByStatusAndTimestamp<TFleetWithStatus extends Fleet>(status: Fleet["status"], orderBy: keyof TFleetWithStatus): Observable<TFleetWithStatus | null> {
    return this.byId$.pipe(
      map(fleets => {
        const fleet = Object.values(fleets)
          .filter(fleet => fleet.status === status)
          .sort((a: TFleetWithStatus, b: TFleetWithStatus) => {
            return (a[orderBy] as any) - (b[orderBy] as any)
          }).find(it => !!it);
        return fleet as TFleetWithStatus || null;
      }),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }
}