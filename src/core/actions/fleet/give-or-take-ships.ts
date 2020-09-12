import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import produce from "immer";

export function giveOrTakeFleetShips(fleetId: string, amount: number, integrity: number = 0): Action {

  let shipDestroyed = false;

  return {
    describe: () => `GiveOrTakeFleetShips ${JSON.stringify({ fleetId, amount, integrity, shipDestroyed })}`,
    apply: (state: GameState) => {

      const fleet = state.universe.fleets[fleetId];
      const newShipsPlusIntegrity = fleet.ships + fleet.integrity + amount + integrity
      
      let newShips = Math.floor(newShipsPlusIntegrity);
      let newIntegrity = newShipsPlusIntegrity % 1;

      if (newIntegrity === 0) {
        newIntegrity = 1;
        newShips--;
      }

      if ( newShips <= 0) {
        shipDestroyed = true;
        return produce(state, draft => {
          delete draft.universe.fleets[fleetId]
        })
      }

      return updateFleet(state, fleetId, fleet => {
        return {
          ...fleet,
          ships: newShips,
          integrity: newIntegrity
        }
      })
    }
  }
}
