import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map, withLatestFrom } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { handleFiring } from "./combat-helper";
import { worldStartFiring } from "../../actions/world/start-firing";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class WorldFireEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private combat: CombatAndCaptureProjector,
    private random: RandomNumberGenerator,
    private setup: GameSetupProvider) {

    this.upcomingEvent$ = this.combat.nextFiringWorld$.pipe(
      withLatestFrom(this.fleets.byCurrentWorldId$),
      map(([world, fleetsByCurrentworldId]) => {
        if (!world) {
          return null;
        }
        return {
          timestamp: world.weaponsReadyTimestamp,
          happen: () => {

            const weaponsReadyTimestamp = world.weaponsReadyTimestamp + random.exponential() * this.setup.rules.combat.meanFiringInterval

            const damageActions = handleFiring(world, world, fleetsByCurrentworldId, this.setup.rules, this.random);

            return [
              ...damageActions, 
              worldStartFiring(world.id, weaponsReadyTimestamp)
            ]
          }
        }
      })
    )
  }

}

