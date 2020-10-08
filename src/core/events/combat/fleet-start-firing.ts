import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { fleetStartFiring } from "../../actions/fleet/start-firing";
import { CombatProjector } from "../../projectors/combat-projector";
import { GameSetupProvider } from "../../game-setup-provider";
import { ReadyFleet } from "../../../shared/model/v1/fleet";

@injectable()
export class FleetStartFiringEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private combat: CombatProjector,
    random: RandomNumberGenerator,
    private setup: GameSetupProvider) {
    const startFiringFleet$ = combineLatest([this.combat.worldIdsAtPeaceAndAtWar$, this.fleets.byId$]).pipe(
      map(([[combatWorldIds, _], fleetsById]) => {

        const fleets = Object.values(fleetsById);

        return fleets.find(fleet =>
          fleet.status === 'READY'
          && combatWorldIds.indexOf(fleet.currentWorldId) !== -1
          && fleet.combatStatus === 'AT_PEACE'
        ) as ReadyFleet | null
      })
    )

    this.upcomingEvent$ = startFiringFleet$.pipe(
      map((fleet) => {
        if (!fleet) {
          return null;
        }
        return {
          notifications: (timestamp) =>  [{
            type: 'ENGAGING_THE_ENEMY',
            fleetId: fleet.id,
            worldId: fleet.currentWorldId,
            playerId: fleet.ownerId,
            timestamp
          }],
          happen: (timestamp: number) => {

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