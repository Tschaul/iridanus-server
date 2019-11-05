import { Action } from "../action";
import { State } from "../../state";
import { updateFleet } from "./update-fleet";

export function popFleetOrder(
  fleetId: string,
): Action {
  return {
    describe: () => `PopFleetOrder ${JSON.stringify({fleetId})}`,
    apply: (state: State) => {

      return updateFleet(state, fleetId, (oldFleet) => {
        return {
          ...oldFleet,
          orders: oldFleet.orders.slice(1)
        }
      })
    }
  }
}