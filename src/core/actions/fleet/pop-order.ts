import { Action } from "../action";
import { State } from "../../state";
import { updateFleet } from "./update-fleet";

export function popOrder(
  fleetId: string,
): Action {
  return {
    describe: () => `PopOrder ${JSON.stringify({fleetId})}`,
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