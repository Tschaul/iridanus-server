import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import produce from "immer";

export function dealDamageToFleet(fleetId: string, amount: number): Action {

  let fleetDestroyed = false;

  return {
    describe: () => `DealDamageToShips ${JSON.stringify({ fleetId, amount, shipDestroyed: fleetDestroyed })}`,
    apply: (state: GameState) => {

      const fleet = state.universe.fleets[fleetId];
      const newShipsPlusIntegrity = fleet.ships + fleet.integrity - amount
      
      let newShips = Math.floor(newShipsPlusIntegrity);
      let newIntegrity = newShipsPlusIntegrity % 1;

      if (newIntegrity === 0 && fleet.integrity !== 0) {
        newIntegrity = 1;
        newShips--;
      }

      if ( newShips <= 0) {
        fleetDestroyed = true;
        return produce(state, draft => {
          delete draft.universe.fleets[fleetId]
        })
      }

      return updateFleet(state, fleetId, fleet => {
        return {
          ...fleet,
          ships: newShips,
          integrity: newIntegrity,
          lastDamageTimestamp: state.currentTimestamp
        }
      })
    }
  }
}
