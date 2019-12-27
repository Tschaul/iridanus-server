import { Action } from "../action";
import { GameState } from "../../state";
import { updateFleet } from "./update-fleet";
import { baseFleet, ReadyFleet, FleetWithOwnerAtWorld } from "../../../shared/model/v1/fleet";

export function fleetReady(
  fleetId: string,
): Action {
  return {
    describe: () => `FleetReady ${JSON.stringify({ fleetId })}`,
    apply: (state: GameState) => {

      return updateFleet<FleetWithOwnerAtWorld, ReadyFleet>(state, fleetId, (oldFleet) => {
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