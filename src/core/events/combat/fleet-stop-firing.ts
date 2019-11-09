import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map, withLatestFrom } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { fleetStopFiring } from "../../actions/fleet/stop-firing";

@injectable()
export class FleetStopFiringEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private combat: CombatAndCaptureProjector,
    private time: TimeProjector) {
    const stopFiringFleets$ = combineLatest(this.combat.worldIdsAtPeaceAndAtWar$, this.fleets.byId$).pipe(
      map(([[_, nonCombatWorldIds], fleetsById]) => {

        const fleets = Object.values(fleetsById);

        return fleets.find(fleet =>
          fleet.status === 'READY'
          && nonCombatWorldIds.indexOf(fleet.currentWorldId) !== -1
          && fleet.combatStatus === 'FIRING'
        )
      })
    )

    this.upcomingEvent$ = stopFiringFleets$.pipe(
      withLatestFrom(this.time.currentTimestamp$),
      map(([fleet, timestamp]) => {
        if(!fleet) {
          return null;
        }
        return {
          timestamp,
          happen: () => {

            return [
              fleetStopFiring(fleet.id)
            ]
          }
        }
      })
    )
  }

}