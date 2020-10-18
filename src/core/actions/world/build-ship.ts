import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { WorldWithOwner } from "../../../shared/model/v1/world";
import { updateWorld } from "./update-world";

export function buildShips(
  worldId: string,
  readyTimestamp: number,
  amount: number,
  activeIndustry: number
): Action {
  return {
    describe: () => `BuildShips ${JSON.stringify({ worldId, readyTimestamp, amount, activeIndustry })}`,
    apply: (state: GameState) => {

      return updateWorld<WorldWithOwner, WorldWithOwner>(state, worldId, (oldWorld) => {
        return {
          ...oldWorld,
          buildShipsStatus: {
            type: 'BUILDING_SHIPS',
            readyTimestamp: readyTimestamp,
            amount: amount,
            activeIndustry: activeIndustry
          }
        }
      })
    }
  }
}
