import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatProjector } from "../../projectors/combat-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { captureWorld } from "../../actions/world/capture";
import { WorldProjector } from "../../projectors/world-projector";
import { PopulationByPlayer, totalPopulation, worldHasOwner, WorldWithOwner } from "../../../shared/model/v1/world";
import { absoluteMajorityHolder } from "../../../shared/math/distributions/distribution-helper";

@injectable()
export class CaptureWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public worlds: WorldProjector,
  ) {
    this.upcomingEvent$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const world = Object.values(worldsById).find(world => {
          if (!worldHasOwner(world)) {
            return false;
          }
          const majorityHolder = absoluteMajorityHolder(world.population);
          return majorityHolder && absoluteMajorityHolder(world.population) !== world.ownerId
        }) as WorldWithOwner

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
