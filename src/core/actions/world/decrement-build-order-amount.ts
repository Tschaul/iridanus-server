import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";

export function decrementBuildOrderAmount(
  worldId: string,
  orderType: 'BUILD_INDUSTRY' | 'BUILD_SHIPS' | 'SCRAP_SHIPS_FOR_INDUSTRY'
): Action {
  return {
    describe: () => `DecrementBuildOrderAmount ${JSON.stringify({ orderType, worldId })}`,
    apply: (state: GameState) => {

      return updateWorld(state, worldId, (oldWorld) => {
        const currentOrder = oldWorld.orders[0];
        if (!currentOrder || currentOrder.type !== orderType || currentOrder.amount === 0) {
          return oldWorld;
        } else if (currentOrder.amount === 1) {
          return {
            ...oldWorld,
            orders: oldWorld.orders.slice(1)
          }
        } else {
          return {
            ...oldWorld,
            orders: [
              {
                ...currentOrder,
                amount: currentOrder.amount - 1
              },
              ...oldWorld.orders.slice(1)
            ]
          }
        }
      })
    }
  }
}