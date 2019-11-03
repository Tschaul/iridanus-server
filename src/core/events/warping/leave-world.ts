import { GameEvent } from "../event";
import { State } from "../../state";
import { PopOrderAction } from "../../actions/fleet/pop-order";
import { LeaveWorldAction } from "../../actions/fleet/leave-world";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { WarpOrder } from "../../model/fleet-orders";
import { ReadyFleet, Fleet } from "../../model/fleet";
import { Universe } from "../../model/universe";
import { universeHasGate } from "../../model/gate-helper";

export const LEAVE_WORLD_DELAY = 1000;

export function upcomingLeaveEvent(state$: Observable<State>): Observable<GameEvent | null> {
  const readyFleetWithWarpOrder$ = state$.pipe(
    map(state => {
      return state.universe.fleets
    }),
    // distinctUntilChanged(),
    map(fleets => {
      const fleet = Object.values(fleets).find(fleet => fleet.status === 'READY'
        && fleet.orders.length
        && fleet.orders[0].type === 'WARP');
      return fleet as ReadyFleet | null;
    }));

  return readyFleetWithWarpOrder$.pipe(
    withLatestFrom(state$),
    map(([fleet, state]) => {
      if (!fleet) {
        return null
      } else {
        return new LeaveWorldEvent(
          fleet,
          fleet.orders[0] as WarpOrder,
          state.currentTimestamp,
          state.universe
        )
      }
    }
    ));
}

export class LeaveWorldEvent implements GameEvent {

  constructor(
    private readonly fleet: ReadyFleet,
    private readonly order: WarpOrder,
    public readonly timestamp: number,
    private readonly universe: Universe,
  ) { }

  happen() {

    if (!universeHasGate(this.universe, this.order.targetWorld, this.fleet.currentWorldId)) {
      console.log("no gate found")
      return [new PopOrderAction(this.fleet.id)];
    }

    return [
      new LeaveWorldAction(this.fleet.id, this.order.targetWorld, this.timestamp + LEAVE_WORLD_DELAY),
      new PopOrderAction(this.fleet.id)
    ];
  }

}