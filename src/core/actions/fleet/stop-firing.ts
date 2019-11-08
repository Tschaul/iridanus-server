import { Action } from "../action";
import { State } from "../../state";
import { updateFleet } from "./update-fleet";
import { baseFleet, ReadyFleet, FleetAtWorld } from "../../model/fleet";

export function fleetStopFiring(
  fleetId: string,
): Action {
  return {
    describe: () => `FleetStopFiring ${JSON.stringify({ fleetId })}`,
    apply: (state: State) => {

      return updateFleet<FleetAtWorld, ReadyFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'READY',
          combatStatus: 'AT_PEACE',
          ownerId: oldFleet.ownerId
        }
      })
    }
  }
}