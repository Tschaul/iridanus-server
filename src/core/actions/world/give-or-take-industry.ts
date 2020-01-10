import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";

export function giveOrTakeWorldIndustry(worldId: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeWorldIndustry ${JSON.stringify({worldId, amount})}`,
    apply: (state: GameState) => {
      return updateWorld(state, worldId, oldWorld => {
        return {
          ...oldWorld,
          industry: oldWorld.industry + amount
        }
      })
    }
  }
}
