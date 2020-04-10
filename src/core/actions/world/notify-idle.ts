import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";

export function notifyWorldIdle(
  worldId: string,
): Action {
  return {
    describe: () => `NotifyWorldIdle ${JSON.stringify({ worldId })}`,
    apply: (state: GameState) => {

      return updateWorld(state, worldId, (oldWorld) => {
        return {
          ...oldWorld,
          idleNotificationSent: true
        }
      })
    }
  }
}