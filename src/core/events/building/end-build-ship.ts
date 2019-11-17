import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { injectable } from "inversify";
import { giveOrTakeWorldShips } from "../../actions/world/give-or-take-ships";
import { BuildingShipWorld } from "../../../shared/model/world";
import { worldReady } from "../../actions/world/world-ready";

@injectable()
export class EndBuildShipsEventQueue implements GameEventQueue {

    public upcomingEvent$: Observable<GameEvent | null>;
    constructor(public worlds: WorldProjector) {
    this.upcomingEvent$ = this.worlds.firstByStatus<BuildingShipWorld>('BUILDING_SHIP').pipe(
      map((world) => {
        if (!world) {
          return null
        } else {
          return {
            timestamp: world.readyTimestamp,
            happen: () => {
              return [
                giveOrTakeWorldShips(world.id, 1),
                worldReady(world.id),
              ];
            }
          }
        }
      })
    )
  }
}
