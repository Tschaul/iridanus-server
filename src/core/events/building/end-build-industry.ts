import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { injectable } from "inversify";
import { giveOrTakeWorldIndustry } from "../../actions/world/give-or-take-industry";
import { BuildingIndustryWorld } from "../../../shared/model/v1/world";
import { worldReady } from "../../actions/world/world-ready";

@injectable()
export class EndBuildIndustryEventQueue implements GameEventQueue {

    public upcomingEvent$: Observable<GameEvent | null>;
    constructor(public worlds: WorldProjector) {
    this.upcomingEvent$ = this.worlds.firstByStatusAndTimestamp<BuildingIndustryWorld>('BUILDING_INDUSTRY', 'readyTimestamp').pipe(
      map((world) => {
        if (!world) {
          return null
        } else {
          return {
            timestamp: world.readyTimestamp,
            happen: () => {
              return [
                giveOrTakeWorldIndustry(world.id, 1),
                worldReady(world.id),
              ];
            }
          }
        }
      })
    )
  }
}
