import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, TransferingCargoFleet, ReadyFleet, WaitingForCargoFleet } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function waitForCargo(
  fleetId: string,
  toWorldId: string
): Action {
  return {
    describe: () => `WaitingForCargo ${JSON.stringify({ fleetId })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet | TransferingCargoFleet, WaitingForCargoFleet>(state, fleetId, (oldFleet) => {

        const fromWorldId = oldFleet.status === 'READY'
          ? oldFleet.currentWorldId
          : oldFleet.fromWorldId;

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