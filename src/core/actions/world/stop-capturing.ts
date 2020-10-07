import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { World, WorldBeingCaptured, WorldNotBeingCaptured } from "../../../shared/model/v1/world";

export function stopConversionAtWorld(
  worldId: string,
): Action {
  return {
    describe: () => `StopConversionAtWorld ${JSON.stringify({ worldId })}`,
    apply: (state: GameState) => {

      return updateWorld<World & WorldBeingCaptured, World & WorldNotBeingCaptured>(state, worldId, (oldWorld) => {
        const result = {
          ...oldWorld,
          captureStatus: 'NOT_BEING_CAPTURED',
        } as any

        delete result.nextConversionTimestamp;
        delete result.nextConvertedPlayerId;
        delete result.nextConvertingPlayerId;

        return result as World & WorldNotBeingCaptured;
      })
    }
  }
}