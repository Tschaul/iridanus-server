import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { WorldWithOwner } from "../../../shared/model/v1/world";

export function worldStopMining(
  worldId: string,
): Action {
  return {
    describe: () => `WorldStopMining ${JSON.stringify({ worldId })}`,
    apply: (state: GameState) => {

      return updateWorld<WorldWithOwner, WorldWithOwner>(state, worldId, (oldWorld) => {
        const newWorld = {
          ...oldWorld,
          miningStatus: { type: 'NOT_MINING' },
        }
        return newWorld as WorldWithOwner;
      })
    }
  }
}