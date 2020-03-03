import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { ReadyWorld, baseWorld, BuildingIndustryWorld, combatAndMiningStatus } from "../../../shared/model/v1/world";
import { updateWorld } from "./update-world";

export function buildIndustry(
  worldId: string,
  readyTimestamp: number
): Action {
  return {
    describe: () => `BuildIndustry ${JSON.stringify({ worldId, readyTimestamp })}`,
    apply: (state: GameState) => {

      return updateWorld<ReadyWorld, BuildingIndustryWorld>(state, worldId, (oldWorld) => {
        return {
          ...baseWorld(oldWorld),
          ...combatAndMiningStatus(oldWorld),
          status: 'BUILDING_INDUSTRY',
          readyTimestamp: readyTimestamp,
          ownerId: oldWorld.ownerId,
        }
      })
    }
  }
}
