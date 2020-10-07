import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { updateWorld } from "./update-world";
import { DominationByPlayerId, PopulationByPlayer, World } from "../../../shared/model/v1/world";

export function startConversionAtWorld(
  worldId: string,
  convertingPlayerId: string,
  convertedPlayerId: string,
  conversionTimestamp: number,
  domination: DominationByPlayerId
): Action {
  return {
    describe: () => `StartConversionAtWorld ${JSON.stringify({ worldId, capturingPlayerId: convertingPlayerId, convertedPlayerId, conversionTimestamp })}`,
    apply: (state: GameState) => {

      return updateWorld<World, World>(state, worldId, (oldWorld) => {
        return {
          ...oldWorld,
          captureStatus: 'BEING_CAPTURED',
          nextConvertedPlayerId: convertedPlayerId,
          nextConvertingPlayerId: convertingPlayerId,
          nextConversionTimestamp: conversionTimestamp,
          lastDomination: domination,
          lastPopulation: oldWorld.population
        }
      })
    }
  }
}