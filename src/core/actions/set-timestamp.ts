import { Action } from "./action";
import { State } from "../state";
import produce from "immer"

export function setTimestamp(newTimestamp: number): Action {
  return {
    describe: () => `SetTimeStamp ${JSON.stringify({newTimestamp})}`,
    apply: (state: State) => {
      return produce(state, (draft) => {
        draft.currentTimestamp = newTimestamp;
      })
    }
  }
}