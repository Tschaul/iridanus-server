import { Action } from "../action";
import { State } from "../../state";
import { baseFleet, LeavingFleet, ArrivingFleet, WarpingFleet } from "../../model/fleet";
import { updateFleet } from "./update-fleet";

export function arriveAtWorld(
  fleetId: string,
  readyTimestamp: number
): Action {
  return {
    describe: () => `ArriveAtWorld ${JSON.stringify({fleetId, readyTimestamp})}`,
    apply: (state: State) => {

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
