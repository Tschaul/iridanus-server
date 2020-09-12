import { Action } from "../action";
import { GameState } from "../../../shared/model/v1/state";
import { FleetAtWorld } from "../../../shared/model/v1/fleet";
import produce from "immer";
import { makeId } from "../../../app/client/make-id";

export function createFleet(
  worldId: string,
  ownerId: string,
  ships: number
): Action {
  return {
    describe: () => `CreateFleet ${JSON.stringify({ worldId, ships })}`,
    apply: (state: GameState) => {

      const fleetId = makeId()

      return produce(state, draft => {

        const fleet: FleetAtWorld = {
          combatStatus: "AT_PEACE",
          currentWorldId: worldId,
          id: fleetId,
          integrity: 1,
          orders: [],
          ownerId,
          status: 'READY',
          ships,
        }

        draft.universe.fleets[fleetId] = fleet;
      })
    }
  }
}