import { Action } from "../action";
import { GameState } from "../../state";
import { updateWorld } from "./update-world";

export function giveOrTakeWorldMetal(worldId: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeWorldMetal ${JSON.stringify({worldId, amount})}`,
    apply: (state: GameState) => {
      return updateWorld(state, worldId, oldWorld => {
        return {
          ...oldWorld,
          metal: oldWorld.metal + amount
        }
      })
    }
  }
}
