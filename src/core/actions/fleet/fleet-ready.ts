import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import { baseFleet, ReadyFleet, FleetAtWorld, WaitingForCargoFleet } from "../../../shared/model/v1/fleet";

export function fleetReady(
  fleetId: string,
): Action {
  return {
    describe: () => `FleetReady ${JSON.stringify({ fleetId })}`,
    apply: (state: GameState) => {

      return updateFleet<FleetAtWorld | WaitingForCargoFleet, ReadyFleet>(state, fleetId, (oldFleet) => {

        const currentWorldId = oldFleet.status === 'WAITING_FOR_CARGO' ? oldFleet.fromWorldId : oldFleet.currentWorldId

        return {
          ...baseFleet(oldFleet),
          currentWorldId,
          status: 'READY',
          combatStatus: 'AT_PEACE',
          ownerId: oldFleet.ownerId,
          idleNotificationSent: false
        }
      })
    }
  }
}