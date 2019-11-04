import { Action } from "../action";
import { State } from "../../state";
import produce from "immer";
import { World } from "../../model/world";

export class GiveOrTakeWorldMetalAction implements Action {

  constructor(public worldId: string, public amount: number) {

  }

  apply(state: State): State {
    return produce(state, draft => {
      const oldWorld = draft.universe.worlds[this.worldId] as World;
      const newWorld: World = {
        ...oldWorld,
        metal: oldWorld.metal + this.amount
      }
      draft.universe.worlds[this.worldId] = newWorld;
    })
  }
}