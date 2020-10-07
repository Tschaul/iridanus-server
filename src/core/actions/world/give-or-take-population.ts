import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { ReadyWorld, LostWorld, WorldWithOwner, World, baseWorld } from "../../../shared/model/v1/world";

export function giveOrTakeWorldPopulation(worldId: string, amount: number, playerId: string | null = null): Action {
  let affectedPlayerId = ''
  return {
    describe: () => `GiveOrTakeWorldPopulation ${JSON.stringify({ worldId, amount, affectedPlayerId })}`,
    apply: (state: GameState) => {
      return updateWorld<WorldWithOwner, World>(state, worldId, oldWorld => {

        affectedPlayerId = playerId ?? oldWorld.ownerId

        if (!affectedPlayerId) {
          throw new Error("No player to give or take population");
        }

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
