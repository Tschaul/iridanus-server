import { Action } from "../action";
import { State } from "../../state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, WorldWithOwner } from "../../../shared/model/world";

export function worldReady(
  worldId: string,
): Action {
  return {
    describe: () => `WorldReady ${JSON.stringify({ worldId })}`,
    apply: (state: State) => {

      return updateWorld<WorldWithOwner, ReadyWorld>(state, worldId, (oldWorld) => {
        return {
          ...baseWorld(oldWorld),
          status: 'READY',
          ownerId: oldWorld.ownerId,
          combatStatus: 'AT_PEACE'
        }
      })
    }
  }
}