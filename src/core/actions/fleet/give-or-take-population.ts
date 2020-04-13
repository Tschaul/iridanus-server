import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";

export function giveOrTakeFleetPopulation(fleetid: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeFleetPopulation ${JSON.stringify({ fleetid, amount })}`,
    apply: (state: GameState) => {
      return updateFleet(state, fleetid, oldFleet => {
        return {
          ...oldFleet,
          population: Math.max(oldFleet.population + amount, 0)
        }
      })
    }
  }
}
