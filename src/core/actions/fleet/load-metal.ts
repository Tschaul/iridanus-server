import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, LeavingFleet, ArrivingFleet, ReadyFleet, LoadingMetalFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function loadMetal(
  fleetId: string,
  amount: number,
  readyTimestamp: number
): Action {
  return {
    describe: () => `LoadMetal ${JSON.stringify({ fleetId, readyTimestamp, amount })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet, LoadingMetalFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'LOADING_METAL',
          readyTimestamp: readyTimestamp,
          ownerId: oldFleet.ownerId,
          transferAmount: amount
        }
      })
    }
  }
}
