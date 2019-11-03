import { Action } from "../action";
import { State } from "../../state";
import produce from "immer"
import { baseFleet, LeavingFleet, ArrivingFleet } from "../../model/fleet";

export class ArriveAtWorldAction implements Action {

  constructor(
    public readonly fleetId: string, 
    public readonly readyTimestamp: number,
  ) {

  }

  apply(state: State): State {
    return produce(state, draft => {
      const oldFleet = draft.universe.fleets[this.fleetId] as LeavingFleet;
      const newFleet: ArrivingFleet = {
        ...baseFleet(oldFleet),
        currentWorldId: oldFleet.targetWorldId,
        status: 'ARRIVING',
        readyTimestamp: this.readyTimestamp,
        ownerId: oldFleet.ownerId
      }
      draft.universe.fleets[this.fleetId] = newFleet;
    })
  }
}