import { GameState } from "../../../shared/model/v1/state";
import produce from "immer";
import { World } from "../../../shared/model/v1/world";

export function updateWorld<Told extends World, Tnew extends World>(
  state: GameState, 
  worldId: string, 
  updater: (oldWorld: Told) => Tnew): GameState {
    const oldWorld = state.universe.worlds[worldId] as Told;
    return produce(state, draft => {
    const newWorld = updater(oldWorld);
    draft.universe.worlds[worldId] = newWorld;
  })
}