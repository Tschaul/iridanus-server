import { Action } from "../action";
import { State } from "../../state";
import produce from "immer"
import { baseFleet, LeavingFleet, WarpingFleet } from "../../model/fleet";

export class WarpToWorldAction implements Action {

  constructor(
    public readonly fleetId: string, 
    public readonly arrivingTimestamp: number,
  ) {

  }

  apply(state: State): State {
    return produce(state, draft => {
      const oldFleet = draft.universe.fleets[this.fleetId] as LeavingFleet;
      const newFleet: WarpingFleet = {
        ...baseFleet(oldFleet),
        targetWorldId: oldFleet.targetWorldId,
        originWorldId: oldFleet.currentWorldId,
        status: 'WARPING',
        arrivingTimestamp: this.arrivingTimestamp,
        ownerId: oldFleet.ownerId
      }
      draft.universe.fleets[this.fleetId] = newFleet;
    })
  }
}