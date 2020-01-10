import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { ReadyWorld, BuildingShipWorld, baseWorld } from "../../../shared/model/v1/world";
import { updateWorld } from "./update-world";

export function buildShip(
  worldId: string,
  readyTimestamp: number
): Action {
  return {
    describe: () => `BuildShip ${JSON.stringify({ worldId, readyTimestamp })}`,
    apply: (state: GameState) => {

      return updateWorld<ReadyWorld, BuildingShipWorld>(state, worldId, (oldWorld) => {
        return {
          ...baseWorld(oldWorld),
          status: 'BUILDING_SHIP',
          readyTimestamp: readyTimestamp,
          ownerId: oldWorld.ownerId,
        }
      })
    }
  }
}
