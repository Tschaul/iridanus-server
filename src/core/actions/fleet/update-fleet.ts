import { Fleet } from "../../../shared/model/v1/fleet";
import { GameState } from "../../../shared/model/v1/state";
import produce from "immer";

export function updateFleet<Told extends Fleet, Tnew extends Fleet>(
  state: GameState, 
  fleetId: string, 
  updater: (oldFleet: Told) => Tnew): GameState {
  return produce(state, draft => {
    const oldFleet = draft.universe.fleets[fleetId] as Told;
    const newFleet = updater(oldFleet);
    draft.universe.fleets[fleetId] = newFleet;
  })
}