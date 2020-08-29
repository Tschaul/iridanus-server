import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";

export function giveOrTakeFleetShips(fleetid: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeFleetShips ${JSON.stringify({fleetid, amount})}`,
    apply: (state: GameState) => {
      return updateFleet(state, fleetid, fleet => {
        const ships = Math.max(fleet.ships + amount, 0);
        return {
          ...fleet,
          ships,
        }
      })
    }
  }
}
