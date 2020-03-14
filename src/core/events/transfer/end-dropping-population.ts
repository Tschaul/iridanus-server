import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DroppingPopulationFleet } from "../../../shared/model/v1/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import { fleetReady } from "../../actions/fleet/fleet-ready";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";

@injectable()
export class EndDroppingPopulationEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;
  constructor(public fleets: FleetProjector) {
    this.upcomingEvent$ = this.fleets.firstByStatus<DroppingPopulationFleet>('DROPPING_POPULATION').pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.readyTimestamp,
            happen: () => {
              return [
                giveOrTakeWorldPopulation(fleet.currentWorldId, fleet.transferAmount),
                fleetReady(fleet.id),
              ];
            }
          }
        }
      })
    )
  }
}
