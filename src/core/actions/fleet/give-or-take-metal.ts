import { Action } from "../action";
import { GameState } from "../../state";
import { updateFleet } from "./update-fleet";

export function giveOrTakeFleetMetal(fleetid: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeFleetMetal ${JSON.stringify({fleetid, amount})}`,
    apply: (state: GameState) => {
      return updateFleet(state, fleetid, oldFleet => {
        return {
          ...oldFleet,
          metal: oldFleet.metal + amount
        }
      })
    }
  }
}
