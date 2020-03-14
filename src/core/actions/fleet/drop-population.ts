import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, ReadyFleet, DroppingPopulationFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function dropPopulation(
  fleetId: string,
  amount: number,
  readyTimestamp: number
): Action {
  return {
    describe: () => `DropPopulation ${JSON.stringify({ fleetId, readyTimestamp, amount })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet, DroppingPopulationFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'DROPPING_POPULATION',
          readyTimestamp: readyTimestamp,
          ownerId: oldFleet.ownerId,
          transferAmount: amount
        }
      })
    }
  }
}
