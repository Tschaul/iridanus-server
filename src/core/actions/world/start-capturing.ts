import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { World } from "../../../shared/model/v1/world";

export function startCapturingWorld(
  worldId: string,
  capturingPlayerId: string,
  captureTimestamp: number,
): Action {
  return {
    describe: () => `StartCapturingWorld ${JSON.stringify({ worldId, capturingPlayerId, captureTimestamp })}`,
    apply: (state: GameState) => {

      return updateWorld<World, World>(state, worldId, (oldWorld) => {
        return {
          ...oldWorld,
          captureStatus: 'BEING_CAPTURED',
          capturingPlayerId,
          captureTimestamp
        }
      })
    }
  }
}