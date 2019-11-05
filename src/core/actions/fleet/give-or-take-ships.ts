import { Action } from "../action";
import { State } from "../../state";
import produce from "immer";
import { Fleet } from "../../model/fleet";

export class GiveOrTakeFleetShipsAction implements Action {

  constructor(public fleetid: string, public amount: number) {

  }

  apply(state: State): State {
    return produce(state, draft => {
      const oldFleet = draft.universe.fleets[this.fleetid] as Fleet;
      const newFleet: Fleet = {
        ...oldFleet,
        ships: oldFleet.ships + this.amount
      }
      draft.universe.fleets[this.fleetid] = newFleet;
    })
  }
}