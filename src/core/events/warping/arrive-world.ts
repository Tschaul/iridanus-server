import { GameEvent } from "../event";
import { State } from "../../state";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArrivingFleet } from "../../model/fleet";
import { FleetReadyAction } from "../../actions/fleet/ready";

export function upcomingArriveWorldEvent(state$: Observable<State>): Observable<GameEvent | null> {
  const leavingFleet$ = state$.pipe(
    map(state => {
      return state.universe.fleets
    }),
    // distinctUntilChanged(),
    map(fleets => {
      const fleet = Object.values(fleets).find(fleet => fleet.status === 'ARRIVING');
      return fleet as ArrivingFleet | null;
    }));

  return leavingFleet$.pipe(
    map((fleet) => {
      if (!fleet) {
        return null
      } else {
        return new ArriveAtWorldEvent(
          fleet,
          fleet.readyTimestamp,
        )
      }
    }
    ));

}

export class ArriveAtWorldEvent implements GameEvent {

  constructor(
    private readonly fleet: ArrivingFleet,
    public readonly timestamp: number,
  ) { }

  happen() {

    return [
      new FleetReadyAction(this.fleet.id),
    ];
  }

}