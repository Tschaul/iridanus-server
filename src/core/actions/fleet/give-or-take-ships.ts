import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";

export function giveOrTakeFleetShips(fleetid: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeFleetShips ${JSON.stringify({fleetid, amount})}`,
    apply: (state: GameState) => {
      return updateFleet(state, fleetid, oldFleet => {
        const newShipsAmount = oldFleet.ships + amount;
        return {
          ...oldFleet,
          ships: newShipsAmount,
          // overloaded metal gets discared (mainly during combat)
          metal: Math.min(newShipsAmount, oldFleet.metal)
        }
      })
    }
  }
}
