import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArrivingFleet } from "../../../shared/model/v1/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import { fleetReady } from "../../actions/fleet/fleet-ready";

@injectable()
export class ArriveAtWorldEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;
  constructor(public fleets: FleetProjector) {
    this.upcomingEvent$ = this.fleets.firstByStatusAndTimestamp<ArrivingFleet>('ARRIVING','readyTimestamp').pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.readyTimestamp,
            happen: () => {
              return [
                fleetReady(fleet.id),
              ];
            }
          }
        }
      }))
  }
}
