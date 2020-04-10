import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LoadingPopulationFleet } from "../../../shared/model/v1/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import { giveOrTakeFleetPopulation } from "../../actions/fleet/give-or-take-population";
import { fleetReady } from "../../actions/fleet/fleet-ready";

@injectable()
export class EndLoadPopulationEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;
  constructor(public fleets: FleetProjector) {
    this.upcomingEvent$ = this.fleets.firstByStatusAndTimestamp<LoadingPopulationFleet>('LOADING_POPULATION', 'readyTimestamp').pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.readyTimestamp,
            happen: () => {
              return [
                giveOrTakeFleetPopulation(fleet.id, fleet.transferAmount),
                fleetReady(fleet.id),
              ];
            }
          }
        }
      })
    )
  }
}
