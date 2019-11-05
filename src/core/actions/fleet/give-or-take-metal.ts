import { Action } from "../action";
import { State } from "../../state";
import { updateFleet } from "./update-fleet";

export function giveOrTakeFleetMetal(fleetid: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeFleetMetal ${JSON.stringify({fleetid, amount})}`,
    apply: (state: State) => {
      return updateFleet(state, fleetid, oldFleet => {
        return {
          ...oldFleet,
          metal: oldFleet.metal + amount
        }
      })
    }
  }
}
