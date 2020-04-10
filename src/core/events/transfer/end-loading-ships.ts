import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LoadingShipsFleet } from "../../../shared/model/v1/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import { giveOrTakeFleetShips } from "../../actions/fleet/give-or-take-ships";
import { fleetReady } from "../../actions/fleet/fleet-ready";

@injectable()
export class EndLoadingShipsEventQueue implements GameEventQueue {

    public upcomingEvent$: Observable<GameEvent | null>;
    constructor(public fleets: FleetProjector) {
    this.upcomingEvent$ = this.fleets.firstByStatusAndTimestamp<LoadingShipsFleet>('LOADING_SHIPS','readyTimestamp').pipe(
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
