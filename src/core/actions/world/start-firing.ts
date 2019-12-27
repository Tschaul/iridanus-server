import { Action } from "../action";
import { GameState } from "../../state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, WorldWithOwner } from "../../../shared/model/v1/world";

export function worldStartFiring(
  worldId: string,
  weaponsReadyTimestamp: number
): Action {
  return {
    describe: () => `WorldStartFiring ${JSON.stringify({ worldId,weaponsReadyTimestamp })}`,
    apply: (state: GameState) => {

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