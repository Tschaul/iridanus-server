import { Action } from "../action";
import { State } from "../../state";
import produce from "immer";
import { ArrivingFleet, ReadyFleet, baseFleet } from "../../model/fleet";

export class FleetReadyAction implements Action {

  constructor(public fleetId: string) {

  }

  apply(state: State): State {
    return produce(state, draft => {
      const oldFleet = draft.universe.fleets[this.fleetId] as ArrivingFleet;
      const newFleet: ReadyFleet = {
        ...baseFleet(oldFleet),
        currentWorldId: oldFleet.currentWorldId,
        status: 'READY',
        ownerId: oldFleet.ownerId
      }
      draft.universe.fleets[this.fleetId] = newFleet;
    })
  }
}