import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import { baseFleet, ReadyFleet, FleetWithOwnerAtWorld } from "../../../shared/model/v1/fleet";

export function fleetStopFiring(
  fleetId: string,
): Action {
  return {
    describe: () => `FleetStopFiring ${JSON.stringify({ fleetId })}`,
    apply: (state: GameState) => {

      return updateFleet<FleetWithOwnerAtWorld, ReadyFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'READY',
          combatStatus: 'AT_PEACE',
          ownerId: oldFleet.ownerId,
          idleNotificationSent: false
        }
      })
    }
  }
}