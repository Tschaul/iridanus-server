import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ScrappingShipsWorld } from "../../../shared/model/v1/world";
import { WorldProjector } from "../../projectors/world-projector";
import { injectable } from "inversify";
import { worldReady } from "../../actions/world/world-ready";
import { giveOrTakeWorldIndustry } from "../../actions/world/give-or-take-industry";

@injectable()
export class EndScrappingShipsEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;
  constructor(public worlds: WorldProjector) {
    this.upcomingEvent$ = this.worlds.firstByStatus<ScrappingShipsWorld>('SCRAPPING_SHIPS').pipe(
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
