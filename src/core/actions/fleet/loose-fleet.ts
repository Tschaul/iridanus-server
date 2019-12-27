import { Action } from "../action";
import { GameState } from "../../state";
import { updateFleet } from "./update-fleet";
import { baseFleet, FleetWithOwnerAtWorld, LostFleet } from "../../../shared/model/v1/fleet";

export function looseFleet(
  fleetId: string,
): Action {
  return {
    describe: () => `LooseFleet ${JSON.stringify({ fleetId })}`,
    apply: (state: GameState) => {

      return updateFleet<FleetWithOwnerAtWorld, LostFleet>(state, fleetId, (oldFleet) => {
        return {
          ...baseFleet(oldFleet),
          currentWorldId: oldFleet.currentWorldId,
          status: 'LOST',
        }
      })
    }
  }
}