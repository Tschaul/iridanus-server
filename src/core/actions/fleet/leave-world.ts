import { Action } from "../action";
import { State } from "../../state";
import { baseFleet, LeavingFleet, ReadyFleet } from "../../../shared/model/fleet";
import { updateFleet } from "./update-fleet";

export function leaveWorld(
  fleetId: string,
  targetWorldId: string,
  warpingTimestamp: number
): Action {
  return {
    describe: () => `LeaveWorld ${JSON.stringify({ fleetId, targetWorldId, warpingTimestamp })}`,
    apply: (state: State) => {
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
