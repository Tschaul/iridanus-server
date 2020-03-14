import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, ReadyFleet, LoadingPopulationFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function loadPopulation(
  fleetId: string,
  amount: number,
  readyTimestamp: number
): Action {
  return {
    describe: () => `LoadPopulation ${JSON.stringify({ fleetId, readyTimestamp, amount })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet, LoadingPopulationFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'LOADING_POPULATION',
          readyTimestamp: readyTimestamp,
          ownerId: oldFleet.ownerId,
          transferAmount: amount
        }
      })
    }
  }
}
