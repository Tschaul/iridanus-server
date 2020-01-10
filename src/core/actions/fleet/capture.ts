import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import { baseFleet, ReadyFleet, LostFleet } from "../../../shared/model/v1/fleet";

export function captureFleet(
  fleetId: string,
  ownerId: string,
): Action {
  return {
    describe: () => `CaptureFleet ${JSON.stringify({ fleetId })}`,
    apply: (state: GameState) => {

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