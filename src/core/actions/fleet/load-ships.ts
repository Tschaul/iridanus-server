import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, ReadyFleet, LoadingShipsFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function loadShips(
  fleetId: string,
  amount: number,
  readyTimestamp: number
): Action {
  return {
    describe: () => `LoadShips ${JSON.stringify({ fleetId, readyTimestamp, amount })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet, LoadingShipsFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'LOADING_SHIPS',
          readyTimestamp: readyTimestamp,
          ownerId: oldFleet.ownerId,
          transferAmount: amount
        }
      })
    }
  }
}
