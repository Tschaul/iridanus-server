import { Action } from "../action";
import { State } from "../../state";
import produce from "immer"
import { ReadyFleet, baseFleet, LeavingFleet } from "../../model/fleet";

export class LeaveWorldAction implements Action {

  constructor(
    public readonly fleetId: string, 
    public readonly targetWorldId: string,
    public readonly warpingTimestamp: number,
  ) {

  }

  apply(state: State): State {
    return produce(state, draft => {
      const oldFleet = draft.universe.fleets[this.fleetId] as ReadyFleet;
      const newFleet: LeavingFleet = {
        ...baseFleet(oldFleet),
        targetWorldId: this.targetWorldId,
        currentWorldId: oldFleet.currentWorldId,
        status: 'LEAVING',
        warpingTimestamp: this.warpingTimestamp,
        ownerId: oldFleet.ownerId
      }
      draft.universe.fleets[this.fleetId] = newFleet;
    })
  }
}