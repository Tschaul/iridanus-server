import { Action } from "../action";
import { GameState } from "../../state";
import { baseFleet, LeavingFleet, ArrivingFleet, ReadyFleet, TransferingMetalFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function transferMetal(
  fleetId: string,
  amount: number,
  readyTimestamp: number
): Action {
  return {
    describe: () => `TransferMetal ${JSON.stringify({ fleetId, readyTimestamp })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet, TransferingMetalFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'TRANSFERING_METAL',
          readyTimestamp: readyTimestamp,
          ownerId: oldFleet.ownerId,
          transferAmount: amount
        }
      })
    }
  }
}
