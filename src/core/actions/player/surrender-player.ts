import produce from "immer"
import { GameState } from "../../../shared/model/v1/state";
import { Action } from "../action";

export function surrenderPlayer(surrenderingPlaer: string): Action {
  return {
    describe: () => `DefeatPlayer ${JSON.stringify({ defeatedPlayer: surrenderingPlaer })}`,
    apply: (state: GameState) => {
      return produce(state, draft => {
        draft.players[surrenderingPlaer].hasSurrendered = true;
      })
    }
  }
}