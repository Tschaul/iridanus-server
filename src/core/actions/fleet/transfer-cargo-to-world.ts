import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseFleet, TransferingCargoFleet, ReadyFleet, fleetIsAtWorld } from "../../../shared/model/v1/fleet";
import { updateFleet } from "./update-fleet";

export function transferCargoToWorld(
  fleetId: string,
  arrivingTimestamp: number,
  cargoMetal: number,
  cargoPopulation: number,
  toWorldId: string,
  cargoRoute: string[]
): Action {
  return {
    describe: () => `TransferingCargoToWorld ${JSON.stringify({ fleetId, toWorldId, arrivingTimestamp, cargoMetal, cargoPopulation })}`,
    apply: (state: GameState) => {

      return updateFleet<ReadyFleet | TransferingCargoFleet, TransferingCargoFleet>(state, fleetId, (oldFleet) => {

        const fromWorldId = fleetIsAtWorld(oldFleet)
          ? oldFleet.currentWorldId
          : oldFleet.toWorldId;

        return {
          ...baseFleet(oldFleet),
          fromWorldId,
          toWorldId,
          status: 'TRANSFERING_CARGO',
          arrivingTimestamp: arrivingTimestamp,
          ownerId: oldFleet.ownerId,
          cargoMetal,
          cargoPopulation,
          cargoRoute
        }
      })
    }
  }
}