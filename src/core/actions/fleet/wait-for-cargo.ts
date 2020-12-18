import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, TransferingCargoFleet, ReadyFleet, WaitingForCargoFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function waitForCargo(
  fleetId: string,
  currentWorldId: string,
  cargoRoute: string[]
): Action {
  return {
    describe: () => `WaitingForCargo ${JSON.stringify({ fleetId, currentWorldId })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet | TransferingCargoFleet, WaitingForCargoFleet>(state, fleetId, (oldFleet) => {

        return {
          ...baseFleet(oldFleet),
          currentWorldId,
          cargoRoute,
          status: 'WAITING_FOR_CARGO',
          ownerId: oldFleet.ownerId,
          idleNotificationSent: false
        }
      })
    }
  }
}