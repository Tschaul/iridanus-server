import { Action } from "../action";
import { State } from "../../state";
import { updateFleet } from "./update-fleet";

export function giveOrTakeFleetShips(fleetid: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeFleetShips ${JSON.stringify({fleetid, amount})}`,
    apply: (state: State) => {
      return updateFleet(state, fleetid, oldFleet => {
        return {
          ...oldFleet,
          ships: oldFleet.ships + amount
        }
      })
    }
  }
}
