import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import { FleetOrder } from "../../../shared/model/v1/fleet-orders";

export function putFleetOrders(
  fleetId: string,
  orders: FleetOrder[]
): Action {
  return {
    describe: () => `PutFleetOrders ${JSON.stringify({fleetId})}`,
    apply: (state: GameState) => {

      return updateFleet(state, fleetId, (oldFleet) => {
        return {
          ...oldFleet,
          orders
        }
      })
    }
  }
}