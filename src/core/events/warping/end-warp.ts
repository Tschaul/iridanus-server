import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WarpingFleet } from "../../model/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { inject } from "inversify";
import { GameConfig, CONFIG } from "../../config";
import { ArriveAtWorldAction } from "../../actions/fleet/arrive-at-world";
import { injectable } from "inversify";
import 'reflect-metadata'

@injectable()
export class EndWarpEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(public fleets: FleetProjector, @inject(CONFIG) config: GameConfig) {
    this.upcomingEvent$ = this.fleets.firstByStatus<WarpingFleet>('WARPING').pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.arrivingTimestamp,
            happen: () => {
              return [
                new ArriveAtWorldAction(fleet.id, fleet.arrivingTimestamp + config.arriveWorldDelay),
              ];
            }
          }
        }
      }))
  }
}