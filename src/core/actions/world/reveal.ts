import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import produce from "immer";

export function revealWorld(
  worldId: string,
  playerId: string,
): Action {
  return {
    describe: () => `RevealWorld ${JSON.stringify({ worldId, playerId })}`,
    apply: (state: GameState) => {
      return produce(state, draft => {
        draft.universe.visibility[playerId][worldId] = {
          id: worldId,
          status: 'VISIBLE'
        };
      })
    }
  }
}