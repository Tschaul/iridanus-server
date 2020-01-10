import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, LeavingFleet, ArrivingFleet, WarpingFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function arriveAtWorld(
  fleetId: string,
  readyTimestamp: number
): Action {
  return {
    describe: () => `ArriveAtWorld ${JSON.stringify({fleetId, readyTimestamp})}`,
    apply: (state: GameState) => {

      return updateFleet<WarpingFleet, ArrivingFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.targetWorldId,
          status: 'ARRIVING',
          readyTimestamp: readyTimestamp,
          ownerId: oldFleet.ownerId
        }
      })
    }
  }
}
