import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArrivingFleet } from "../../model/fleet";
import { FleetReadyAction } from "../../actions/fleet/ready";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import 'reflect-metadata'

@injectable()
export class ArriveAtWorldEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;
  constructor(public fleets: FleetProjector) {
    this.upcomingEvent$ = this.fleets.firstByStatus<ArrivingFleet>('ARRIVING').pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.readyTimestamp,
            happen: () => {
              return [
                new FleetReadyAction(fleet.id),
              ];
            }
          }
        }
      }))
  }
}
