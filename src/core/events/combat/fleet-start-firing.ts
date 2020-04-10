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
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import { WorldProjector } from "../../projectors/world-projector";
import { worldhasOwner } from "../../../shared/model/v1/world";

@injectable()
export class FleetStartFiringEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private worlds: WorldProjector,
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
        ) as ReadyFleet | null
      })
    )

    this.upcomingEvent$ = combineLatest(
      startFiringFleet$,
      this.time.currentTimestamp$,
      this.worlds.byId$
    ).pipe(
      map(([fleet, timestamp, worldsById]) => {
        if (!fleet) {
          return null;
        }
        const world = worldsById[fleet.currentWorldId];
        return {
          notifications: [{
            type: 'ENGAGING_THE_ENEMY',
            fleetId: fleet.id,
            worldId: fleet.currentWorldId,
            playerId: fleet.ownerId,
            timestamp
          }],
          timestamp,
          happen: () => {

            const weaponsReadyTimestamp = Math.round(timestamp + random.exponential() * this.setup.rules.combat.meanFiringInterval)

            return [
              fleetStartFiring(fleet.id, weaponsReadyTimestamp)
            ]
          }
        }
      })
    )
  }

}