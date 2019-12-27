import { Action } from "../action";
import { GameState } from "../../state";
import { updateFleet } from "./update-fleet";
import { baseFleet, ReadyFleet, FleetWithOwnerAtWorld } from "../../../shared/model/v1/fleet";

export function fleetStartFiring(
  fleetId: string,
  weaponsReadyTimestamp: number
): Action {
  return {
    describe: () => `FleetStartFiring ${JSON.stringify({ fleetId,weaponsReadyTimestamp })}`,
    apply: (state: GameState) => {

      return updateFleet<FleetWithOwnerAtWorld, ReadyFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'READY',
          combatStatus: 'FIRING',
          weaponsReadyTimestamp,
          ownerId: oldFleet.ownerId
        }
      })
    }
  }
}