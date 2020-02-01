import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";

export function giveOrTakeWorldShips(worldId: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeWorldShips ${JSON.stringify({worldId, amount})}`,
    apply: (state: GameState) => {
      return updateWorld(state, worldId, oldWorld => {
        return {
          ...oldWorld,
          ships: oldWorld.ships + amount,
          metal: Math.min(oldWorld.metal, oldWorld.ships + amount)
        }
      })
    }
  }
}
