import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable, inject } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map, withLatestFrom } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { fleetStartFiring } from "../../actions/fleet/start-firing";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class FleetStartFiringEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private combat: CombatAndCaptureProjector,
    private time: TimeProjector,
    private random: RandomNumberGenerator,
    private setup: GameSetupProvider) {
    const startFiringFleet$ = combineLatest(this.combat.worldIdsAtPeaceAndAtWar$, this.fleets.byId$).pipe(
      map(([[combatWorldIds, _], fleetsById]) => {

        const fleets = Object.values(fleetsById);

        return fleets.find(fleet =>
          fleet.status === 'READY'
          && combatWorldIds.indexOf(fleet.currentWorldId) !== -1
          && fleet.combatStatus === 'AT_PEACE'
        )
      })
    )

    this.upcomingEvent$ = startFiringFleet$.pipe(
      withLatestFrom(this.time.currentTimestamp$),
      map(([fleet, timestamp]) => {
        if(!fleet) {
          return null;
        }
        return {
          timestamp,
          happen: () => {

            const weaponsReadyTimestamp = timestamp + random.exponential() * this.setup.rules.combat.meanFiringInterval
            console.log("start firing weaponsReadyTimestamp", weaponsReadyTimestamp)

            return [
              fleetStartFiring(fleet.id, weaponsReadyTimestamp)
            ]
          }
        }
      })
    )
  }

}