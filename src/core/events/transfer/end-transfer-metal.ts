import { GameEvent } from "../event";
import { State } from "../../state";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TransferingMetalFleet } from "../../model/fleet";
import { FleetReadyAction } from "../../actions/fleet/ready";
import { GiveOrTakeFleetMetalAction } from "../../actions/fleet/give-or-take-metal";

export function upcomingEndTransferMetalEvent(state$: Observable<State>): Observable<GameEvent | null> {
  const leavingFleet$ = state$.pipe(
    map(state => {
      return state.universe.fleets
    }),
    // distinctUntilChanged(),
    map(fleets => {
      const fleet = Object.values(fleets).find(fleet => fleet.status === 'TRANSFERING_METAL');
      return fleet as TransferingMetalFleet | null;
    }));

  return leavingFleet$.pipe(
    map((fleet) => {
      if (!fleet) {
        return null
      } else {
        return new EndTransferMetalEvent(
          fleet,
          fleet.readyTimestamp,
        )
      }
    }
    ));

}

export class EndTransferMetalEvent implements GameEvent {

  constructor(
    private readonly fleet: TransferingMetalFleet,
    public readonly timestamp: number,
  ) { }

  happen() {

    return [
      new GiveOrTakeFleetMetalAction(this.fleet.id, this.fleet.transferAmount),
      new FleetReadyAction(this.fleet.id),
    ];
  }

}