import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, TransferingCargoFleet, ReadyFleet, WaitingForCargoFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function waitForCargo(
  fleetId: string,
  toWorldId: string,
  fromWorldId: string,
): Action {
  return {
    describe: () => `WaitingForCargo ${JSON.stringify({ fleetId, toWorldId })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet | TransferingCargoFleet, WaitingForCargoFleet>(state, fleetId, (oldFleet) => {

        return {
          ...baseFleet(oldFleet),
          fromWorldId,
          toWorldId,
          status: 'WAITING_FOR_CARGO',
          ownerId: oldFleet.ownerId,
        }
      })
    }
  }
}