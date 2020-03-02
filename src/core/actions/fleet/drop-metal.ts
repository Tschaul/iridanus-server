import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, ReadyFleet, DroppingMetalFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function dropMetal(
  fleetId: string,
  amount: number,
  readyTimestamp: number
): Action {
  return {
    describe: () => `DropMetal ${JSON.stringify({ fleetId, readyTimestamp, amount })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet, DroppingMetalFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'DROPPING_METAL',
          readyTimestamp: readyTimestamp,
          ownerId: oldFleet.ownerId,
          transferAmount: amount
        }
      })
    }
  }
}
