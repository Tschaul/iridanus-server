import { Action } from "../action";
import { GameState } from "../../state";
import { updateWorld } from "./update-world";
import { World } from "../../../shared/model/v1/world";

export function setWorldIntegrity(
  worldId: string,
  integrity: number
): Action {
  return {
    describe: () => `SetIntegrity ${JSON.stringify({ worldId, integrity })}`,
    apply: (state: GameState) => {

      return updateWorld<World, World>(state, worldId, (oldWorld) => {

        return {
          ...oldWorld,
          integrity,
        }

      })
    }
  }
}