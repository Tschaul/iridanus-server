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
import { totalPopulation } from "../../../shared/model/v1/world";

@injectable()
export class WorldStartGrowingEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private setup: GameSetupProvider,
    private random: RandomNumberGenerator) {

    const startGrowingWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world => {
          if ('populationGrowthStatus' in world
            && totalPopulation(world) > 0
            && totalPopulation(world) < world.populationLimit) {
            if (world.populationGrowthStatus === 'NOT_GROWING') {
              return true;
            } else if (world.populationGrowthStatus === 'GROWING'
              && world.growingPopulation !== totalPopulation(world)) {
              return true;
            }
          }
        }

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

            const nextPopulationGrowthTimestamp = timestamp
              + calculatePopulationGrowthDelay(world, this.setup.rules.population.minimumPopulationGrowthDelay) * this.random.exponential();

            return [
              worldStartGrowing(world.id, nextPopulationGrowthTimestamp, totalPopulation(world))
            ]
          }
        }
      })
    )
  }

}