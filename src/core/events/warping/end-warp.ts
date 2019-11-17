import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WarpingFleet } from "../../../shared/model/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { inject } from "inversify";
import { injectable } from "inversify";
import { arriveAtWorld } from "../../actions/fleet/arrive-at-world";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class EndWarpEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public fleets: FleetProjector, 
    private setup: GameSetupProvider
  ) {
    this.upcomingEvent$ = this.fleets.firstByStatus<WarpingFleet>('WARPING').pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.arrivingTimestamp,
            happen: () => {
              return [
                arriveAtWorld(fleet.id, fleet.arrivingTimestamp + this.setup.rules.warping.arriveWorldDelay),
              ];
            }
          }
        }
      }))
  }
}