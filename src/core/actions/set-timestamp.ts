import { Action } from "./action";
import { State } from "../state";
import produce from "immer"

export class SetTimestampAction implements Action {

  constructor(private newTimestamp: number) {}

  apply(state: State): State {
    return produce(state, (draft) => {
      draft.currentTimestamp = this.newTimestamp;
    })
  }

}