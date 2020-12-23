import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LeavingFleet, ReadyFleet } from "../../../shared/model/v1/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import { warpToWorld } from "../../actions/fleet/warp-to-world";
import { GameSetupProvider } from "../../game-setup-provider";
import { SplitFleetOrder } from "../../../shared/model/v1/fleet-orders";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { giveOrTakeFleetShips } from "../../actions/fleet/give-or-take-ships";
import { createFleet } from "../../actions/fleet/create-fleet";

@injectable()
export class FleetSplitsEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public fleets: FleetProjector,
  ) {
    this.upcomingEvent$ = this.fleets.firstByStatusAndNextOrderType<ReadyFleet, SplitFleetOrder>('READY', 'SPLIT_FLEET').pipe(
      map(([fleet, order]) => {
        if (!fleet) {
          return null
        } else {
          return {
            happen: () => {

              if (fleet.ships === 1) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              const shipsOfNewFleet = Math.floor(fleet.ships * 0.5);

              return [
                popFleetOrder(fleet.id),
                giveOrTakeFleetShips(fleet.id, -1 * shipsOfNewFleet),
                createFleet(fleet.currentWorldId, fleet.ownerId, shipsOfNewFleet)
              ];
            }
          }
        }
      }))
  }
}
