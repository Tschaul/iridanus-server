import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, LostWorld } from "../../../shared/model/v1/world";

export function captureWorld(
  worldId: string,
  ownerId: string,
): Action {
  return {
    describe: () => `CaptureWorld ${JSON.stringify({ worldId })}`,
    apply: (state: GameState) => {

      return updateWorld<LostWorld, ReadyWorld>(state, worldId, (oldWorld) => {
        return {
          ...baseWorld(oldWorld),
          status: 'READY',
          combatStatus: 'AT_PEACE',
          ownerId: ownerId,
          miningStatus: 'NOT_MINING',
          populationGrowthStatus: 'NOT_GROWING'
        }
      })
    }
  }
}