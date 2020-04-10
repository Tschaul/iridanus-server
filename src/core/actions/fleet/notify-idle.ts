import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";

export function notifyFleetIdle(
  fleetId: string,
): Action {
  return {
    describe: () => `NotifyFleetIdle ${JSON.stringify({ fleetId })}`,
    apply: (state: GameState) => {

      return updateFleet(state, fleetId, (oldFleet) => {
        return {
          ...oldFleet,
          idleNotificationSent: true
        }
      })
    }
  }
}