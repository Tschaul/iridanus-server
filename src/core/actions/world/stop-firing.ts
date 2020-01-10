import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, WorldWithOwner } from "../../../shared/model/v1/world";

export function worldStopFiring(
  worldId: string,
): Action {
  return {
    describe: () => `WorldStopFiring ${JSON.stringify({ worldId })}`,
    apply: (state: GameState) => {

      return updateWorld<WorldWithOwner, ReadyWorld>(state, worldId, (oldWorld) => {
        return {
          ...baseWorld(oldWorld),
          status: 'READY',
          combatStatus: 'AT_PEACE',
          ownerId: oldWorld.ownerId
        }
      })
    }
  }
}