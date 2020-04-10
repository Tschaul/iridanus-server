import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map, withLatestFrom } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { worldStartFiring } from "../../actions/world/start-firing";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { GameSetupProvider } from "../../game-setup-provider";
import { worldhasOwner, WorldWithOwner } from "../../../shared/model/v1/world";

@injectable()
export class WorldStartFiringEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private combat: CombatAndCaptureProjector,
    private time: TimeProjector,
    private random: RandomNumberGenerator,
    private setup: GameSetupProvider) {
    const startFiringWorld$ = combineLatest(this.combat.worldIdsAtPeaceAndAtWar$, this.worlds.byId$).pipe(
      map(([[combatWorldIds, _], worldsById]) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world =>
          worldhasOwner(world)
          && combatWorldIds.indexOf(world.id) !== -1
          && world.combatStatus === 'AT_PEACE'
        ) as WorldWithOwner | null
      })
    )

    this.upcomingEvent$ = combineLatest(
      startFiringWorld$,
      this.time.currentTimestamp$
    ).pipe(
      map(([world, timestamp]) => {
        if (!world) {
          return null;
        }
        return {
          notifications: [{
            type: 'WORLD_IS_UNDER_ATTACK',
            worldId: world.id,
            playerId: world.ownerId,
            timestamp
          }],
          timestamp,
          happen: () => {

            const weaponsReadyTimestamp = Math.round(timestamp + random.exponential() * this.setup.rules.combat.meanFiringInterval);

            return [
              worldStartFiring(world.id, weaponsReadyTimestamp)
            ]
          }
        }
      })
    )
  }

}