import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import { baseFleet, ReadyFleet } from "../../../shared/model/v1/fleet";

export function fleetStartFiring(
  fleetId: string,
  weaponsReadyTimestamp: number
): Action {
  return {
    describe: () => `FleetStartFiring ${JSON.stringify({ fleetId,weaponsReadyTimestamp })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet, ReadyFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'READY',
          combatStatus: 'FIRING',
          weaponsReadyTimestamp,
          ownerId: oldFleet.ownerId,
          idleNotificationSent: oldFleet.idleNotificationSent
        }
      })
    }
  }
}