import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { GameSetupProvider } from "../../game-setup-provider";
import { WorldProjector } from "../../projectors/world-projector";
import { GrowingWorld, pickPopulationOwner, World } from "../../../shared/model/v1/world";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { worldStopGrowing } from "../../actions/world/stop-growing";

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
            return [
              giveOrTakeWorldPopulation(world.id, 1, pickPopulationOwner(world, this.random.equal())),
              worldStopGrowing(world.id)
            ]
          }
        }
      })
    )
  }

}

