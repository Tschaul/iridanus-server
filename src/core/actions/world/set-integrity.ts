import { Action } from "../action";
import { State } from "../../state";
import { updateWorld } from "./update-world";
import { World } from "../../model/world";

export function setWorldIntegrity(
  worldId: string,
  integrity: number
): Action {
  return {
    describe: () => `SetIntegrity ${JSON.stringify({ worldId, integrity })}`,
    apply: (state: State) => {

      return updateWorld<World, World>(state, worldId, (oldWorld) => {

        return {
          ...oldWorld,
          integrity,
        }

      })
    }
  }
}