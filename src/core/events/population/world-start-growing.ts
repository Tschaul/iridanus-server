import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { GameSetupProvider } from "../../game-setup-provider";
import { calculatePopulationGrowthDelay } from "./growth-dealy-helper";
import { worldStartGrowing } from "../../actions/world/start-growing";
import { totalPopulation, worldHasOwner, WorldWithOwner } from "../../../shared/model/v1/world";

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
          if (worldHasOwner(world)
            && totalPopulation(world) > 0
            && totalPopulation(world) < world.populationLimit) {
            if (world.populationGrowthStatus.type === 'NOT_GROWING') {
              return true;
            } else if (world.populationGrowthStatus.type === 'GROWING'
              && world.populationGrowthStatus.growingPopulation !== totalPopulation(world)) {
              return true;
            }
          }
        }) as WorldWithOwner | null
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