import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import { Fleet, FleetWithOwnerAtWorld } from "../../../shared/model/v1/fleet";

export function setFleetIntegrity(
  fleetId: string,
  integrity: number
): Action {
  return {
    describe: () => `SetIntegrity ${JSON.stringify({ fleetId, integrity })}`,
    apply: (state: GameState) => {

      return updateFleet<FleetWithOwnerAtWorld, Fleet>(state, fleetId, (oldFleet) => {

        return {
          ...oldFleet,
          integrity,
        }

      })
    }
  }
}