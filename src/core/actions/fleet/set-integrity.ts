import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import { Fleet, FleetAtWorld } from "../../../shared/model/v1/fleet";

export function setFleetIntegrity(
  fleetId: string,
  integrity: number
): Action {
  return {
    describe: () => `SetIntegrity ${JSON.stringify({ fleetId, integrity })}`,
    apply: (state: GameState) => {

      return updateFleet<FleetAtWorld, Fleet>(state, fleetId, (oldFleet) => {

        return {
          ...oldFleet,
          integrity,
        }

      })
    }
  }
}