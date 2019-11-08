import { Action } from "../action";
import { State } from "../../state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, WorldWithOwner } from "../../model/world";

export function worldStopFiring(
  worldId: string,
): Action {
  return {
    describe: () => `WorldStopFiring ${JSON.stringify({ worldId })}`,
    apply: (state: State) => {

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