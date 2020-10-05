import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { ReadyWorld, BuildingShipsWorld, baseWorld, combatAndMiningStatus } from "../../../shared/model/v1/world";
import { updateWorld } from "./update-world";

export function buildShips(
  worldId: string,
  readyTimestamp: number,
  amount: number
): Action {
  return {
    describe: () => `BuildShips ${JSON.stringify({ worldId, readyTimestamp })}`,
    apply: (state: GameState) => {

      return updateWorld<ReadyWorld, BuildingShipsWorld>(state, worldId, (oldWorld) => {
        return {
          ...baseWorld(oldWorld),
          ...combatAndMiningStatus(oldWorld),
          status: 'BUILDING_SHIPS',
          readyTimestamp: readyTimestamp,
          ownerId: oldWorld.ownerId,
          buildingShipsAmount: amount,
          buildingShipsLastState: oldWorld
        }
      })
    }
  }
}
