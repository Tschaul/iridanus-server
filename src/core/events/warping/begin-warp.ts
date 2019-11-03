import { GameEvent } from "../event";
import { State } from "../../state";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { LeavingFleet } from "../../model/fleet";
import { WarpToWorldAction } from "../../actions/fleet/warp-to-world";

export const WARP_TO_WORLD_DELAY = 1000;

export function upcomingBeginWarpEvent(state$: Observable<State>): Observable<GameEvent | null> {
  const leavingFleet$ = state$.pipe(
    map(state => {
      return state.universe.fleets
    }),
    // distinctUntilChanged(),
    map(fleets => {
      const fleet = Object.values(fleets).find(fleet => fleet.status === 'LEAVING');
      return fleet as LeavingFleet | null;
    }));

  return leavingFleet$.pipe(
    map((fleet) => {
      if (!fleet) {
        return null
      } else {
        return new BeginWarpEvent(
          fleet,
          fleet.warpingTimestamp,
        )
      }
    }
    ));

}

export class BeginWarpEvent implements GameEvent {

  constructor(
    private readonly fleet: LeavingFleet,
    public readonly timestamp: number,
  ) { }

  happen() {

    return [
      new WarpToWorldAction(this.fleet.id, this.timestamp + WARP_TO_WORLD_DELAY),
    ];
  }

}