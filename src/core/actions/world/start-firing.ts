import { Action } from "../action";
import { State } from "../../state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, WorldWithOwner } from "../../../shared/model/world";

export function worldStartFiring(
  worldId: string,
  weaponsReadyTimestamp: number
): Action {
  return {
    describe: () => `WorldStartFiring ${JSON.stringify({ worldId,weaponsReadyTimestamp })}`,
    apply: (state: State) => {

      return updateWorld<WorldWithOwner, ReadyWorld>(state, worldId, (oldWorld) => {
        return {
          ...baseWorld(oldWorld),
          status: 'READY',
          combatStatus: 'FIRING',
          weaponsReadyTimestamp,
          ownerId: oldWorld.ownerId
        }
      })
    }
  }
}