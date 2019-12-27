import { Action } from "./action";
import { GameState } from "../state";
import produce from "immer"

export function setTimestamp(newTimestamp: number): Action {
  return {
    describe: () => `SetTimeStamp ${JSON.stringify({newTimestamp})}`,
    apply: (state: GameState) => {
      return produce(state, (draft) => {
        draft.currentTimestamp = newTimestamp;
      })
    }
  }
}