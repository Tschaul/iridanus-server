import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TransferingMetalFleet } from "../../model/fleet";
import { FleetReadyAction } from "../../actions/fleet/ready";
import { GiveOrTakeFleetMetalAction } from "../../actions/fleet/give-or-take-metal";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";

@injectable()
export class EndTransferMetalEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;
  constructor(public fleets: FleetProjector) {
    this.upcomingEvent$ = this.fleets.firstByStatus<TransferingMetalFleet>('TRANSFERING_METAL').pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.readyTimestamp,
            happen: () => {
              return [
                new GiveOrTakeFleetMetalAction(fleet.id, fleet.transferAmount),
                new FleetReadyAction(fleet.id),
              ];
            }
          }
        }
      })
    )
  }
}
