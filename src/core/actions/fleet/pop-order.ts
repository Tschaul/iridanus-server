import { Action } from "../action";
import { State } from "../../state";
import produce from "immer"

export class PopOrderAction implements Action {

  constructor(public fleetId: string) {

  }

  apply(state: State): State {
    const res =  produce(state, draft => {
      draft.universe.fleets[this.fleetId].orders = draft.universe.fleets[this.fleetId].orders.slice(1);
    })
    return res;
  }
}