import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable, inject } from "inversify";
import { map, withLatestFrom } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { fleetStartFiring } from "../../actions/fleet/start-firing";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { handleFiring } from "./combat-helper";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class FleetFireEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private fleets: FleetProjector,
    private combat: CombatAndCaptureProjector,
    private random: RandomNumberGenerator,
    private setup: GameSetupProvider) {

    this.upcomingEvent$ =
      combineLatest(
        this.combat.nextFiringFleet$,
        this.worlds.byId$,
        this.fleets.byCurrentWorldId$
      ).pipe(
        map(([fleet, worldsById, fleetsByCurrentworldId]) => {
          if (!fleet) {
            return null;
          }
          
          return {
            timestamp: fleet.weaponsReadyTimestamp,
            happen: () => {

              const weaponsReadyTimestamp = fleet.weaponsReadyTimestamp + random.exponential() * this.setup.rules.combat.meanFiringInterval

              const world = worldsById[fleet.currentWorldId];

              const damageActions = handleFiring(fleet, world, fleetsByCurrentworldId, this.setup.rules, this.random);

              return [
                ...damageActions,
                fleetStartFiring(fleet.id, weaponsReadyTimestamp)
              ]

            }
          }
        })
      )
  }


}