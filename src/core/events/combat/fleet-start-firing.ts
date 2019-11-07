import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TimeProjector } from "../../projectors/time-projector";
import { CONFIG, GameConfig } from "../../config";
import { map, withLatestFrom, distinctUntilKeyChanged } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { Fleet, FleetAtPeace } from "../../model/fleet";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { startFiring } from "../../actions/fleet/start-firing";
import { CombatProjector } from "../../projectors/combat-projector";

@injectable()
export class FleetStartFiringEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private combat: CombatProjector,
    private time: TimeProjector,
    random: RandomNumberGenerator,
    @inject(CONFIG) config: GameConfig) {
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

            const weaponsReadyTimestamp = timestamp + random.exponential() * config.combat.meanFiringInterval

            return [
              startFiring(fleet.id, weaponsReadyTimestamp)
            ]
          }
        }
      })
    )
  }

}