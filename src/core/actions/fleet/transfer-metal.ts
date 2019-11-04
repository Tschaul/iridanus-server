import { Action } from "../action";
import { State } from "../../state";
import produce from "immer"
import { ReadyFleet, baseFleet, TransferingMetalFleet } from "../../model/fleet";

export class TransferMetalAction implements Action {

  constructor(
    public readonly fleetId: string, 
    public readonly amount: number,
    public readonly readyTimestamp: number,
  ) {

  }

  apply(state: State): State {
    return produce(state, draft => {
      const oldFleet = draft.universe.fleets[this.fleetId] as ReadyFleet;
      const newFleet: TransferingMetalFleet = {
        ...baseFleet(oldFleet),
        currentWorldId: oldFleet.currentWorldId,
        status: 'TRANSFERING_METAL',
        readyTimestamp: this.readyTimestamp,
        ownerId: oldFleet.ownerId,
        transferAmount: this.amount
      }
      draft.universe.fleets[this.fleetId] = newFleet;
    })
  }
}