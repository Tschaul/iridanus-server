import produce from "immer"
import { GameState } from "../../../shared/model/v1/state";
import { Action } from "../action";

export function defeatPlayer(defeatedPlayerId: string): Action {
  return {
    describe: () => `DefeatPlayer ${JSON.stringify({ defeatedPlayer: defeatedPlayerId })}`,
    apply: (state: GameState) => {
      return produce(state, draft => {
        draft.players[defeatedPlayerId].status = 'DEFEATED'
        Object.getOwnPropertyNames(draft.universe.worlds).forEach(worldId => {
          const world = draft.universe.worlds[worldId];
          if (world.status === 'OWNED' && world.ownerId === defeatedPlayerId) {
            world.ownerId = '@defeated'
            world.population['@defeated'] = world.population[defeatedPlayerId] ?? 0;
            delete world.population[defeatedPlayerId];
            world.miningStatus = { type: 'NOT_MINING' };
            world.populationGrowthStatus = { type: 'NOT_GROWING' };
            world.populationConversionStatus = { type: 'NOT_BEING_CAPTURED' };
            world.buildShipsStatus = { type: 'NOT_BUILDING_SHIPS' };
          }
        })
        Object.getOwnPropertyNames(draft.universe.fleets).forEach(fleetId => {
          const fleet = draft.universe.fleets[fleetId];
          if (fleet.ownerId === defeatedPlayerId) {
            fleet.ownerId = '@defeated'
          }
        })
      })
    }
  }
}