import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, ReadyFleet, TransferingShipsFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function transferShips(
  fleetId: string,
  amount: number,
  readyTimestamp: number
): Action {
  return {
    describe: () => `TransferShips ${JSON.stringify({ fleetId, readyTimestamp })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet, TransferingShipsFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'TRANSFERING_SHIPS',
          readyTimestamp: readyTimestamp,
          ownerId: oldFleet.ownerId,
          transferAmount: amount
        }
      })
    }
  }
}
