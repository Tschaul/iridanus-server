import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { ReadyWorld, LostWorld, baseWorld } from "../../../shared/model/v1/world";

export function giveOrTakeWorldPopulation(worldId: string, amount: number): Action {
  let worldLost = false;
  return {
    describe: () => `GiveOrTakeWorldPopulation ${JSON.stringify({worldId, amount, worldLost})}`,
    apply: (state: GameState) => {
      return updateWorld<ReadyWorld, ReadyWorld | LostWorld>(state, worldId, oldWorld => {

        const newPopulation = Math.max(oldWorld.population + amount, 0);

        if (newPopulation === 0) {
          worldLost = true;
          return {
            ...baseWorld(oldWorld),
            status: 'LOST',
            population: 0
          }
        }

        return {
          ...oldWorld,
          population: Math.max(oldWorld.population + amount, 0)
        }
      })
    }
  }
}
