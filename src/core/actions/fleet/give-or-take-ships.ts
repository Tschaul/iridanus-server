import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateFleet } from "./update-fleet";

export function giveOrTakeFleetShips(fleetid: string, amount: number): Action {
  return {
    describe: () => `GiveOrTakeFleetShips ${JSON.stringify({fleetid, amount})}`,
    apply: (state: GameState) => {
      return updateFleet(state, fleetid, fleet => {
        const ships = Math.max(fleet.ships + amount, 0);
        let metal = fleet.metal;
        let population = fleet.population;
        // overloaded metal and population gets discared (mainly during combat)
        const overload = metal + population - ships;
        if (overload > 0) {
          if (overload > metal) {
            metal = 0;
            population -= overload - metal;
          } else {
            metal -= overload;
          }
        }
        return {
          ...fleet,
          ships,
          metal,
          population: Math.max(population, 0)
        }
      })
    }
  }
}
