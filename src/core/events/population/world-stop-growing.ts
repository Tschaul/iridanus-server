import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { worldStopGrowing } from "../../actions/world/stop-growing";
import { totalPopulation, worldHasOwner } from "../../../shared/model/v1/world";

@injectable()
export class WorldStopGrowingEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private time: TimeProjector
  ) {

    const stopGrowingWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world =>
          'populationGrowthStatus' in world
          && world.populationGrowthStatus === 'GROWING'
          && totalPopulation(world) >= world.populationLimit
        )
      })
    )

    this.upcomingEvent$ = stopGrowingWorld$.pipe(
      map((world) => {
        if (!world) {
          return null;
        }
        return {
          notifications:  (timestamp: number) => worldHasOwner(world) ? [{
            type: 'POPULATION_LIMIT_REACHED',
            worldId: world.id,
            playerId: world.ownerId,
            timestamp
          }] : [],
          happen: () => {
            return [
              worldStopGrowing(world.id)
            ]
          }
        }
      })
    )
  }

}