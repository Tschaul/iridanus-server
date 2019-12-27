import { Action } from "../action";
import { GameState } from "../../state";
import { baseFleet, LeavingFleet, WarpingFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function warpToWorld(
  fleetId: string,
  arrivingTimestamp: number
): Action {
  return {
    describe: () => `WarpToWorld ${JSON.stringify({ fleetId, arrivingTimestamp })}`,
    apply: (state: GameState) => {

      return updateFleet<LeavingFleet, WarpingFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          targetWorldId: oldFleet.targetWorldId,
          originWorldId: oldFleet.currentWorldId,
          status: 'WARPING',
          arrivingTimestamp: arrivingTimestamp,
          ownerId: oldFleet.ownerId
        }
      })
    }
  }
}