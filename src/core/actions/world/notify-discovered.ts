import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import produce from "immer";

export function notifyWorldDiscovered(
  worldId: string,
  playerId: string,
): Action {
  return {
    describe: () => `NotifyWorldDiscovered ${JSON.stringify({ worldId, playerId })}`,
    apply: (state: GameState) => {
      return produce(state, draft => {
        draft.universe.worlds[worldId].worldDiscoveredNotificationSent = true;
      })
    }
  }
}