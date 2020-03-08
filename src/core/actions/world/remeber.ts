import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import produce from "immer";
import { worldhasOwner } from "../../../shared/model/v1/world";

export function rememberWorld(
  worldId: string,
  playerId: string,
): Action {
  return {
    describe: () => `RememberWorld ${JSON.stringify({ worldId, playerId })}`,
    apply: (state: GameState) => {
      const world = state.universe.worlds[worldId];
      const timestampe = state.currentTimestamp;
      return produce(state, draft => {
        draft.universe.visibility[playerId][worldId] = {
          id: worldId,
          status: 'REMEBERED',
          industry: world.industry,
          mines: world.mines,
          population: world.population,
          populationLimit: world.populationLimit,
          ownerId: worldhasOwner(world) ? world.ownerId : undefined,
          remeberedTimestamp: timestampe
        };
      })
    }
  }
}