import { Action } from "../action";
import { State } from "../../state";
import { ReadyWorld, BuildingShipWorld, baseWorld } from "../../model/world";
import { updateWorld } from "./update-world";

export function buildShip(
  worldId: string,
  readyTimestamp: number
): Action {
  return {
    describe: () => `BuildShip ${JSON.stringify({ worldId, readyTimestamp })}`,
    apply: (state: State) => {

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
