import { Action } from "../action";
import { State } from "../../state";
import { ReadyWorld, baseWorld, BuildingIndustryWorld } from "../../../shared/model/world";
import { updateWorld } from "./update-world";

export function buildIndustry(
  worldId: string,
  readyTimestamp: number
): Action {
  return {
    describe: () => `BuildIndustry ${JSON.stringify({ worldId, readyTimestamp })}`,
    apply: (state: State) => {

      return updateWorld<ReadyWorld, BuildingIndustryWorld>(state, worldId, (oldWorld) => {
        return {
          ...baseWorld(oldWorld),
          status: 'BUILDING_INDUSTRY',
          readyTimestamp: readyTimestamp,
          ownerId: oldWorld.ownerId,
        }
      })
    }
  }
}
