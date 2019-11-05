import { Action } from "../action";
import { State } from "../../state";
import { updateWorld } from "./update-world";

export function giveOrTakeWorldShips(worldId: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeWorldShips ${JSON.stringify({worldId, amount})}`,
    apply: (state: State) => {
      return updateWorld(state, worldId, oldWorld => {
        return {
          ...oldWorld,
          ships: oldWorld.ships + amount
        }
      })
    }
  }
}
