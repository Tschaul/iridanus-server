import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { WorldOrder } from "../../../shared/model/v1/world-order";

export function putWorldOrders(
  worldId: string,
  orders: WorldOrder[]
): Action {
  return {
    describe: () => `PutWorldOrders ${JSON.stringify({worldId})}`,
    apply: (state: GameState) => {

      return updateWorld(state, worldId, (oldWorld) => {
        return {
          ...oldWorld,
          orders
        }
      })
    }
  }
}