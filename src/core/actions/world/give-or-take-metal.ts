import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";

export function giveOrTakeWorldMetal(worldId: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeWorldMetal ${JSON.stringify({worldId, amount})}`,
    apply: (state: GameState) => {
      return updateWorld(state, worldId, oldWorld => {
        return {
          ...oldWorld,
          metal: Math.max(oldWorld.metal + amount, 0)
        }
      })
    }
  }
}
