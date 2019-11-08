import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { CONFIG, GameConfig } from "../../config";
import { map, withLatestFrom } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { fleetStartFiring } from "../../actions/fleet/start-firing";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { handleFiring } from "./combat-helper";

@injectable()
export class FleetFireEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private fleets: FleetProjector,
    private combat: CombatAndCaptureProjector,
    private random: RandomNumberGenerator,
    @inject(CONFIG) private config: GameConfig) {

    this.upcomingEvent$ = this.combat.nextFiringFleet$.pipe(
      withLatestFrom(this.worlds.byId$, this.fleets.byCurrentWorldId$),
      map(([fleet, worldsById, fleetsByCurrentworldId]) => {
        if (!fleet) {
          return null;
        }
        return {
          timestamp: fleet.weaponsReadyTimestamp,
          happen: () => {

            const weaponsReadyTimestamp = fleet.weaponsReadyTimestamp + random.exponential() * config.combat.meanFiringInterval

            const world = worldsById[fleet.currentWorldId];

            const damageActions = handleFiring(fleet, world, fleetsByCurrentworldId, this.config, this.random);

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