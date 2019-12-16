import { Action } from "../action";
import { State } from "../../state";
import { updateFleet } from "./update-fleet";
import { baseFleet, FleetWithOwnerAtWorld, LostFleet } from "../../../shared/model/fleet";

export function looseFleet(
  fleetId: string,
): Action {
  return {
    describe: () => `LooseFleet ${JSON.stringify({ fleetId })}`,
    apply: (state: State) => {

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