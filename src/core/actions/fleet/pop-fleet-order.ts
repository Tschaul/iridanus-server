import { Action } from "../action";
import { GameState } from "../../state";
import { updateFleet } from "./update-fleet";

export function popFleetOrder(
  fleetId: string,
): Action {
  return {
    describe: () => `PopFleetOrder ${JSON.stringify({fleetId})}`,
    apply: (state: GameState) => {

      return updateFleet(state, fleetId, (oldFleet) => {
        return {
          ...oldFleet,
          orders: oldFleet.orders.slice(1)
        }
      })
    }
  }
}