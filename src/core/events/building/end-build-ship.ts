import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { injectable } from "inversify";
import { BuildingShipWorld } from "../../../shared/model/v1/world";
import { worldReady } from "../../actions/world/world-ready";
import { createFleet } from "../../actions/fleet/create-fleet";

@injectable()
export class EndBuildShipsEventQueue implements GameEventQueue {

    public upcomingEvent$: Observable<GameEvent | null>;
    constructor(public worlds: WorldProjector) {
    this.upcomingEvent$ = this.worlds.firstByStatusAndTimestamp<BuildingShipWorld>('BUILDING_SHIP', 'readyTimestamp').pipe(
      map((world) => {
        if (!world) {
          return null
        } else {
          return {
            timestamp: world.readyTimestamp,
            happen: () => {
              return [
                createFleet(world.id, world.ownerId, world.buildingShipsAmount),
                worldReady(world.id),
              ];
            }
          }
        }
      })
    )
  }
}
