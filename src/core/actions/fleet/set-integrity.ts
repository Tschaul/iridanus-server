import { Action } from "../action";
import { State } from "../../state";
import { updateFleet } from "./update-fleet";
import { Fleet, FleetAtWorld } from "../../../shared/model/fleet";

export function setFleetIntegrity(
  fleetId: string,
  integrity: number
): Action {
  return {
    describe: () => `SetIntegrity ${JSON.stringify({ fleetId, integrity })}`,
    apply: (state: State) => {

      return updateFleet<FleetAtWorld, Fleet>(state, fleetId, (oldFleet) => {

        return {
          ...oldFleet,
          integrity,
        }

      })
    }
  }
}