import { Action } from "../action";
import { State } from "../../state";
import { updateWorld } from "./update-world";
import { baseWorld, ReadyWorld, LostWorld } from "../../../shared/model/world";

export function captureWorld(
  worldId: string,
  ownerId: string,
): Action {
  return {
    describe: () => `CaptureWorld ${JSON.stringify({ worldId })}`,
    apply: (state: State) => {

      return updateWorld<LostWorld, ReadyWorld>(state, worldId, (oldWorld) => {
        return {
          ...baseWorld(oldWorld),
          status: 'READY',
          combatStatus: 'AT_PEACE',
          ownerId: ownerId
        }
      })
    }
  }
}