import { Action } from "./action";
import { GameState } from "../../shared/model/v1/state";
import produce from "immer"

export function setTimestamp(newTimestamp: number): Action {
  return {
    describe: () => `SetTimeStamp ${JSON.stringify({newTimestamp})}`,
    apply: (state: GameState) => {
      if ((state.currentTimestamp > newTimestamp)) {
        return state;
      }
      return produce(state, (draft) => {
        draft.currentTimestamp = newTimestamp;
      })
    }
  }
}