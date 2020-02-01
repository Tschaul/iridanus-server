import { GameState } from "../../../shared/model/v1/state";
import produce from "immer";
import { World } from "../../../shared/model/v1/world";

export function updateWorld<Told extends World, Tnew extends World>(
  state: GameState, 
  worldId: string, 
  updater: (oldFleet: Told) => Tnew): GameState {
  return produce(state, draft => {
    const oldWorld = draft.universe.worlds[worldId] as Told;
    const newWorld = updater(oldWorld);
    draft.universe.worlds[worldId] = newWorld;
  })
}