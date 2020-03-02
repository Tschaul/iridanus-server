import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, ReadyFleet, DroppingShipsFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function dropShips(
  fleetId: string,
  amount: number,
  readyTimestamp: number
): Action {
  return {
    describe: () => `DropShips ${JSON.stringify({ fleetId, readyTimestamp, amount })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet, DroppingShipsFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'DROPPING_SHIPS',
          readyTimestamp: readyTimestamp,
          ownerId: oldFleet.ownerId,
          transferAmount: amount
        }
      })
    }
  }
}
