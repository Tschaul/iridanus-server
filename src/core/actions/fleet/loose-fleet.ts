import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import produce from "immer";

export function looseFleet(
  fleetId: string,
): Action {
  return {
    describe: () => `LooseFleet ${JSON.stringify({ fleetId })}`,
    apply: (state: GameState) => {

      return produce(state, draft => {
        delete draft.universe.fleets[fleetId] 
      })

    }
  }
}