import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { CONFIG, GameConfig } from "../../config";
import { map, withLatestFrom } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { CombatProjector } from "../../projectors/combat-projector";
import { handleFiring } from "./combat-helper";
import { worldStartFiring } from "../../actions/world/start-firing";

@injectable()
export class WorldFireEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private combat: CombatProjector,
    private random: RandomNumberGenerator,
    @inject(CONFIG) config: GameConfig) {

    this.upcomingEvent$ = this.combat.nextFiringWorld$.pipe(
      withLatestFrom(this.fleets.byCurrentWorldId$),
      map(([world, fleetsByCurrentworldId]) => {
        if (!world) {
          return null;
        }
        return {
          timestamp: world.weaponsReadyTimestamp,
          happen: () => {

            const weaponsReadyTimestamp = world.weaponsReadyTimestamp + random.exponential() * config.combat.meanFiringInterval

            const damageActions = handleFiring(world, world, fleetsByCurrentworldId, config, this.random);

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

