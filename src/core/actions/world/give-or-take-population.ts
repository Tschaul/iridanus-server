import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { ReadyWorld, LostWorld } from "../../../shared/model/v1/world";

export function giveOrTakeWorldPopulation(worldId: string, amount: number, playerId: string | null = null): Action {
  let worldLost = false;
  return {
    describe: () => `GiveOrTakeWorldPopulation ${JSON.stringify({worldId, amount, worldLost})}`,
    apply: (state: GameState) => {
      return updateWorld<ReadyWorld, ReadyWorld | LostWorld>(state, worldId, oldWorld => {

        const affectedPlayerId = playerId ?? oldWorld.ownerId

        const currentPopulation = oldWorld.population[affectedPlayerId] ?? 0;

        const newPopulation = Math.max(currentPopulation + amount, 0);

        return {
          ...oldWorld,
          population: {
            ...oldWorld.population,
            [affectedPlayerId]: newPopulation
          }
        }
      })
    }
  }
}
