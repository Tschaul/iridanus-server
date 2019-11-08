import { Action } from "../action";
import { State } from "../../state";
import { updateFleet } from "./update-fleet";
import { baseFleet, ReadyFleet, LostFleet } from "../../model/fleet";

export function captureFleet(
  fleetId: string,
  ownerId: string,
): Action {
  return {
    describe: () => `CaptureFleet ${JSON.stringify({ fleetId })}`,
    apply: (state: State) => {

      return updateFleet<LostFleet, ReadyFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'READY',
          combatStatus: 'AT_PEACE',
          ownerId: ownerId
        }
      })
    }
  }
}