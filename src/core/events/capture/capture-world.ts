import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatProjector } from "../../projectors/combat-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { captureWorld } from "../../actions/world/capture";
import { WorldProjector } from "../../projectors/world-projector";
import { PopulationByPlayer, totalPopulation, worldHasOwner } from "../../../shared/model/v1/world";

@injectable()
export class CaptureWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public worlds: WorldProjector,
  ) {
    this.upcomingEvent$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const world = Object.values(worldsById).find(world => {
          const majorityHolder = absoluteMajorityHolder(world.population);
          return worldHasOwner(world) && majorityHolder && absoluteMajorityHolder(world.population) !== world.ownerId
        })

        if (!world) {
          return null
        } else {

          const newOwnerId = absoluteMajorityHolder(world.population) as string;

          return {
            notifications: (timestamp) => [{
              type: 'WORLD_CAPTURED',
              worldId: world.id,
              playerId: newOwnerId,
              timestamp
            }],
            happen: () => {
              return [
                captureWorld(world.id, newOwnerId),
              ];
            }
          }
        }
      })
    )
  }
}

function absoluteMajorityHolder(population: PopulationByPlayer) {
  let totalPopulation = 0;
  let maxPopulation = 0;
  let majorityHolder: string | null = null;
  for (const playerId of Object.getOwnPropertyNames(population)) {
    totalPopulation += population[playerId];
    if (population[playerId] >= maxPopulation) {
      maxPopulation = population[playerId];
      majorityHolder = playerId;
    }
  }

  if (maxPopulation > Math.ceil(totalPopulation / 2)) {
    return majorityHolder
  } else {
    return null
  }

}
