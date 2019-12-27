import { Action } from "../action";
import { GameState } from "../../state";
import { updateWorld } from "./update-world";

export function popWorldOrder(
  worldId: string,
): Action {
  return {
    describe: () => `PopWorldOrder ${JSON.stringify({worldId})}`,
    apply: (state: GameState) => {

      return updateWorld(state, worldId, (oldWorld) => {
        return {
          ...oldWorld,
          orders: oldWorld.orders.slice(1)
        }
      })
    }
  }
}