import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map, withLatestFrom } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { worldStartMining } from "../../actions/world/start-mining";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { GameSetupProvider } from "../../game-setup-provider";
import { calculatePopulationGrowthDelay } from "./growth-dealy-helper";
import { worldStartGrowing } from "../../actions/world/start-growing";

@injectable()
export class WorldStartGrowingEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private time: TimeProjector,
    private setup: GameSetupProvider) {

    const startGrowingWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world =>
          'populationGrowthStatus' in world
          && world.populationGrowthStatus === 'NOT_GROWING'
          && world.population > 0
          && world.population < world.populationLimit
        )
      })
    )

    this.upcomingEvent$ = startGrowingWorld$.pipe(
      map((world) => {
        if (!world) {
          return null;
        }
        return {
          happen: (timestamp: number) => {

            const nextMetalMinedTimestamp = timestamp + calculatePopulationGrowthDelay(world, this.setup.rules.population.minimumPopulationGrowthDelay);

            return [
              worldStartGrowing(world.id, nextMetalMinedTimestamp)
            ]
          }
        }
      })
    )
  }

}