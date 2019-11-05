import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LeavingFleet } from "../../model/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { inject } from "inversify";
import { GameConfig, CONFIG } from "../../config";
import { WarpToWorldAction } from "../../actions/fleet/warp-to-world";
import { injectable } from "inversify";
import 'reflect-metadata'

@injectable()
export class BeginWarpEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(public fleets: FleetProjector, @inject(CONFIG) config: GameConfig) {
    this.upcomingEvent$ = this.fleets.firstByStatus<LeavingFleet>('LEAVING').pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.warpingTimestamp,
            happen: () => {
              return [
                new WarpToWorldAction(fleet.id, fleet.warpingTimestamp + config.warpToWorldDelay),
              ];
            }
          }
        }
      }))
  }
}
