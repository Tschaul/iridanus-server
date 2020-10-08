import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { World } from "../../../shared/model/v1/world";

export function giveOrTakeWorldPopulation(worldId: string, amount: number, playerId: string): Action {
  return {
    describe: () => `GiveOrTakeWorldPopulation ${JSON.stringify({ worldId, amount, playerId })}`,
    apply: (state: GameState) => {
      return updateWorld<World, World>(state, worldId, oldWorld => {

        if (!playerId) {
          throw new Error("No player to give or take population");
        }

        if (oldWorld.status === 'LOST') {
          if (amount !== 0) {
            throw new Error("Cannot give or take population from lsot world.");
          } else {
            return oldWorld;
          }
        }

        const currentPopulation = oldWorld.population[playerId] ?? 0;

        const newPopulation = Math.max(currentPopulation + amount, 0);

        return {
          ...oldWorld,
          population: {
            ...oldWorld.population,
            [playerId]: newPopulation
          }
        }
      })
    }
  }
}
