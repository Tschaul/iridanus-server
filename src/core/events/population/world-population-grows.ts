import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { GameSetupProvider } from "../../game-setup-provider";
import { WorldProjector } from "../../projectors/world-projector";
import { GrowingWorld, World } from "../../../shared/model/v1/world";
import { worldStartGrowing } from "../../actions/world/start-growing";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { calculatePopulationGrowthDelay } from "./growth-dealy-helper";

@injectable()
export class WorldPopulationGrowsEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private setup: GameSetupProvider) {

    const nextGrowingWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return (worlds.filter(world =>
          'populationGrowthStatus' in world
          && world.populationGrowthStatus === 'GROWING'
        ) as Array<GrowingWorld & World>).sort((a, b) => a.nextPopulationGrowthTimestamp - b.nextPopulationGrowthTimestamp)[0] || null
      })
    )

    this.upcomingEvent$ = nextGrowingWorld$.pipe(
      map((world) => {
        if (!world) {
          return null;
        }
        return {
          timestamp: world.nextPopulationGrowthTimestamp,
          happen: () => {

            const nextPopulationGrowthTimestamp = world.nextPopulationGrowthTimestamp + calculatePopulationGrowthDelay(world, this.setup.rules.population.minimumPopulationGrowthDelay);

            return [
              giveOrTakeWorldPopulation(world.id, 1),
              worldStartGrowing(world.id, nextPopulationGrowthTimestamp)
            ]
          }
        }
      })
    )
  }

}

