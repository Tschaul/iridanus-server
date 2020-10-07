import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, WorldWithOwner, combatCaptureAndMiningStatus } from "../../../shared/model/v1/world";

export function worldStopMining(
  worldId: string,
): Action {
  return {
    describe: () => `WorldStopMining ${JSON.stringify({ worldId })}`,
    apply: (state: GameState) => {

      return updateWorld<WorldWithOwner, WorldWithOwner>(state, worldId, (oldWorld) => {
        const newWorld = {
          ...oldWorld,
          miningStatus: 'NOT_MINING',
        }

        if ('nextMetalMinedTimestamp' in newWorld) {
          delete newWorld.nextMetalMinedTimestamp;
        }

        return newWorld as WorldWithOwner;
      })
    }
  }
}