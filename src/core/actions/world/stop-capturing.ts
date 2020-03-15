import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { World, WorldBeingCaptured, WorldNotBeingCaptured } from "../../../shared/model/v1/world";

export function stopCapturingWorld(
  worldId: string,
): Action {
  return {
    describe: () => `StopCapturingWorld ${JSON.stringify({ worldId })}`,
    apply: (state: GameState) => {

      return updateWorld<World & WorldBeingCaptured, World & WorldNotBeingCaptured>(state, worldId, (oldWorld) => {
        const result = {
          ...oldWorld,
          captureStatus: 'NOT_BEING_CAPTURED',
        }

        delete result.captureTimestamp;
        delete result.capturingPlayerId;

        return result as World & WorldNotBeingCaptured;
      })
    }
  }
}