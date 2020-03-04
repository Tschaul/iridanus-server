import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { baseWorld, ReadyWorld, ScrappingShipsWorld } from "../../../shared/model/v1/world";
import { updateWorld } from "./update-world";

export function scrapShips(
  worldId: string,
  amount: number,
  readyTimestamp: number
): Action {
  return {
    describe: () => `ScrapShips ${JSON.stringify({ worldId, readyTimestamp, amount })}`,
    apply: (state: GameState) => {

      return updateWorld<ReadyWorld, ScrappingShipsWorld>(state, worldId, (oldWorld) => {
        return {
          ...oldWorld,
          status: 'SCRAPPING_SHIPS',
          readyTimestamp: readyTimestamp,
        }
      })
    }
  }
}
