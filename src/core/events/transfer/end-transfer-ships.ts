import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TransferingShipsFleet } from "../../model/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import { giveOrTakeFleetShips } from "../../actions/fleet/give-or-take-ships";
import { fleetReady } from "../../actions/fleet/ready";

@injectable()
export class EndTransferShipsEventQueue implements GameEventQueue {

    public upcomingEvent$: Observable<GameEvent | null>;
    constructor(public fleets: FleetProjector) {
    this.upcomingEvent$ = this.fleets.firstByStatus<TransferingShipsFleet>('TRANSFERING_SHIPS').pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.readyTimestamp,
            happen: () => {
              return [
                giveOrTakeFleetShips(fleet.id, fleet.transferAmount),
                fleetReady(fleet.id),
              ];
            }
          }
        }
      })
    )
  }
}
