import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, LeavingFleet, ReadyFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function leaveWorld(
  fleetId: string,
  targetWorldId: string,
  warpingTimestamp: number
): Action {
  return {
    describe: () => `LeaveWorld ${JSON.stringify({ fleetId, targetWorldId, warpingTimestamp })}`,
    apply: (state: GameState) => {
      return updateFleet<ReadyFleet, LeavingFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          targetWorldId: targetWorldId,
          currentWorldId: oldFleet.currentWorldId,
          status: 'LEAVING',
          warpingTimestamp: warpingTimestamp,
          ownerId: oldFleet.ownerId
        }
      })
    }
  }
}
