import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { GrowingWorld,  worldHasOwner, WorldWithOwner } from "../../../shared/model/v1/world";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { worldStopGrowing } from "../../actions/world/stop-growing";
import { pickFromDistribution } from "../../../shared/math/distributions/distribution-helper";

@injectable()
export class WorldPopulationGrowsEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private random: RandomNumberGenerator
  ) {

    const nextGrowingWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return (worlds.filter(world =>
          worldHasOwner(world)
          && world.populationGrowthStatus.type === 'GROWING'
        ) as Array<WorldWithOwner & { populationGrowthStatus: GrowingWorld }>).sort((a, b) => a.populationGrowthStatus.nextPopulationGrowthTimestamp - b.populationGrowthStatus.nextPopulationGrowthTimestamp)[0] || null
      })
    )

    this.upcomingEvent$ = nextGrowingWorld$.pipe(
      map((world) => {
        if (!world) {
          return null;
        }
        return {
          timestamp: world.populationGrowthStatus.nextPopulationGrowthTimestamp,
          happen: () => {
            return [
              giveOrTakeWorldPopulation(world.id, 1, pickFromDistribution(world.population, this.random.equal())),
              worldStopGrowing(world.id)
            ]
          }
        }
      })
    )
  }

}

