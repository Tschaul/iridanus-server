import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { WorldWithOwner } from "../../../shared/model/v1/world";

export function worldStartGrowing(
  worldId: string,
  nextPopulationGrowthTimestamp: number,
  growingPopulation: number
): Action {
  return {
    describe: () => `WorldStartGrowing ${JSON.stringify({ worldId, nextPopulationGrowthTimestamp, growingPopulation })}`,
    apply: (state: GameState) => {

      return updateWorld<WorldWithOwner, WorldWithOwner>(state, worldId, (oldWorld) => {
        return {
          ...oldWorld,
          populationGrowthStatus: {
            type: 'GROWING',
            nextPopulationGrowthTimestamp,
            growingPopulation
          }
        }
      })
    }
  }
}