import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { looseFleet } from "../../actions/fleet/loose-fleet";
import { FleetProjector } from "../../projectors/fleet-projector";

@injectable()
export class LooseFleetEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public fleet: FleetProjector,
    public time: TimeProjector,
  ) {
    this.upcomingEvent$ = this.fleet.byId$.pipe(
      map((fleetsById) => {

        const fleet = Object.values(fleetsById).find(fleet => {
          fleet.ships <= 0;
        })

        if (!fleet) {
          return null
        } else {
          return {
            happen: () => {
              return [
                looseFleet(fleet.id),
              ];
            }
          }
        }
      })
    )
  }
}
