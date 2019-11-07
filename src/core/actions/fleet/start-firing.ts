import { Action } from "../action";
import { State } from "../../state";
import { updateFleet } from "./update-fleet";
import { baseFleet, ReadyFleet, FleetAtWorld } from "../../model/fleet";

export function startFiring(
  fleetId: string,
  weaponsReadyTimestamp: number
): Action {
  return {
    describe: () => `StartFiring ${JSON.stringify({ fleetId,weaponsReadyTimestamp })}`,
    apply: (state: State) => {

      return updateFleet<FleetAtWorld, ReadyFleet>(state, fleetId, (oldFleet) => {
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