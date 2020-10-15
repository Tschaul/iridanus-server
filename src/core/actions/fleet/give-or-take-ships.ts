import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";
import produce from "immer";

export function giveOrTakeFleetShips(fleetId: string, amount: number): Action {

  let fleetDestroyed = false;

  return {
    describe: () => `GiveOrTakeFleetShips ${JSON.stringify({ fleetId, amount, shipDestroyed: fleetDestroyed })}`,
    apply: (state: GameState) => {

      const fleet = state.universe.fleets[fleetId];
      const newShips = fleet.ships + amount
      
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
        }
      })
    }
  }
}
