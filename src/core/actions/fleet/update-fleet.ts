import { Fleet } from "../../model/fleet";
import { State } from "../../state";
import produce from "immer";

export function updateFleet<Told extends Fleet, Tnew extends Fleet>(
  state: State, 
  fleetId: string, 
  updater: (oldFleet: Told) => Tnew): State {
  return produce(state, draft => {
    const oldFleet = draft.universe.fleets[fleetId] as Told;
    const newFleet = updater(oldFleet);
    draft.universe.fleets[fleetId] = newFleet;
    console.log("updating fleet "+fleetId,{oldFleet, newFleet});
  })
}