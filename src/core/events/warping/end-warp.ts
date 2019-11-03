import { GameEvent } from "../event";
import { State } from "../../state";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WarpingFleet } from "../../model/fleet";
import { ArriveAtWorldAction } from "../../actions/fleet/arrive-at-world";

export const ARRIVE_DELAY = 1000;

export function upcomingEndWarpEvent(state$: Observable<State>): Observable<GameEvent | null> {
  const leavingFleet$ = state$.pipe(
    map(state => {
      return state.universe.fleets
    }),
    // distinctUntilChanged(),
    map(fleets => {
      const fleet = Object.values(fleets).find(fleet => fleet.status === 'WARPING');
      return fleet as WarpingFleet | null;
    }));

  return leavingFleet$.pipe(
    map((fleet) => {
      if (!fleet) {
        return null
      } else {
        return new EndWarpEvent(
          fleet,
          fleet.arrivingTimestamp,
        )
      }
    }
    ));

}

export class EndWarpEvent implements GameEvent {

  constructor(
    private readonly fleet: WarpingFleet,
    public readonly timestamp: number,
  ) { }

  happen() {

    return [
      new ArriveAtWorldAction(this.fleet.id, this.timestamp + ARRIVE_DELAY),
    ];
  }

}