import { Action } from "./action";
import { State } from "../state";
import produce from "immer"

export class IncreaseCounterAction implements Action {
  apply(state: State): State {
    return produce(state, (draft) => {
      draft.counter++;
    })
  }

}