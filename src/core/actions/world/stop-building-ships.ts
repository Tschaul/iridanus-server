import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { WorldWithOwner } from "../../../shared/model/v1/world";

export function stopBuildingShips(
  worldId: string,
): Action {
  return {
    describe: () => `StopBuildingShips ${JSON.stringify({ worldId })}`,
    apply: (state: GameState) => {

      return updateWorld<WorldWithOwner, WorldWithOwner>(state, worldId, (oldWorld) => {
        return {
          ...oldWorld,
          buildShipsStatus: { type: 'NOT_BUILDING_SHIPS' }
        }
      })
    }
  }
}