import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, LostWorld, World, WorldBeingCaptured, WorldNotBeingCaptured, WorldWithOwner } from "../../../shared/model/v1/world";

export function captureWorld(
  worldId: string,
  newOwnerId: string,
): Action {
  return {
    describe: () => `CaptureWorld ${JSON.stringify({ worldId, newOwnerId })}`,
    apply: (state: GameState) => {

      return updateWorld<World, WorldWithOwner>(state, worldId, (oldWorld) => {
        const result: WorldWithOwner = {
          ...baseWorld(oldWorld),
          status: 'OWNED',
          combatStatus: { type: 'AT_PEACE' },
          ownerId: newOwnerId,
          miningStatus: { type: 'NOT_MINING' },
          populationGrowthStatus: { type: 'NOT_GROWING' },
          populationConversionStatus: { type: 'NOT_BEING_CAPTURED' },
          buildShipsStatus: { type: 'NOT_BUILDING_SHIPS' },
          population: {}
        }

        return result;
      })
    }
  }
}