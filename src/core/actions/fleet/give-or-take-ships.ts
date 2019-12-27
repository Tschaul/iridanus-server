import { Action } from "../action";
import { GameState } from "../../state";
import { updateFleet } from "./update-fleet";

export function giveOrTakeFleetShips(fleetid: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeFleetShips ${JSON.stringify({fleetid, amount})}`,
    apply: (state: GameState) => {
      return updateFleet(state, fleetid, oldFleet => {
        return {
          ...oldFleet,
          ships: oldFleet.ships + amount
        }
      })
    }
  }
}
