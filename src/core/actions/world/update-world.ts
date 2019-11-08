import { State } from "../../state";
import produce from "immer";
import { World } from "../../model/world";

export function updateWorld<Told extends World, Tnew extends World>(
  state: State, 
  worldId: string, 
  updater: (oldFleet: Told) => Tnew): State {
  return produce(state, draft => {
    const oldWorld = draft.universe.worlds[worldId] as Told;
    const newWorld = updater(oldWorld);
    draft.universe.worlds[worldId] = newWorld;
    console.log("updating world "+worldId,{oldWorld, newWorld});
  })
}