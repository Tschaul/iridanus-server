import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, LostWorld, World, WorldBeingCaptured, WorldNotBeingCaptured } from "../../../shared/model/v1/world";

export function captureWorld(
  worldId: string,
  newOwnerId: string,
): Action {
  return {
    describe: () => `CaptureWorld ${JSON.stringify({ worldId, newOwnerId })}`,
    apply: (state: GameState) => {

      if (!newOwnerId) {
        throw new Error("BOOOOOOOOOOOOM");
        
      }

      return updateWorld<World & WorldBeingCaptured, ReadyWorld & WorldNotBeingCaptured>(state, worldId, (oldWorld) => {
        const result: any = {
          ...baseWorld(oldWorld),
          status: 'READY',
          combatStatus: 'AT_PEACE',
          ownerId: newOwnerId,
          miningStatus: 'NOT_MINING',
          populationGrowthStatus: 'NOT_GROWING',
          captureStatus: 'NOT_BEING_CAPTURED',
          orders: []
        }

        delete result.capturingPlayerId;
        delete result.captureTimestamp;

        return result;
      })
    }
  }
}