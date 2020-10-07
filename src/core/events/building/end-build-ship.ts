import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { injectable } from "inversify";
import { BuildingShipsStatus, BuildingShipsWorld, totalPopulation, worldHasOwner, WorldWithOwner } from "../../../shared/model/v1/world";
import { stopBuildingShips } from "../../actions/world/stop-building-ships";
import { createFleet } from "../../actions/fleet/create-fleet";

@injectable()
export class EndBuildShipsEventQueue implements GameEventQueue {

    public upcomingEvent$: Observable<GameEvent | null>;
    constructor(public worlds: WorldProjector) {

      
    const buildingShipsWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return (worlds.filter(world =>
          worldHasOwner(world)
          && world.buildShipsStatus.type === 'BUILDING_SHIPS'
        ) as Array<WorldWithOwner & { buildShipsStatus: BuildingShipsWorld }>).sort((a, b) => a.buildShipsStatus.readyTimestamp - b.buildShipsStatus.readyTimestamp)[0] || null
      
      })
    )
    this.upcomingEvent$ = buildingShipsWorld$.pipe(
      map((world) => {
        if (!world) {
          return null
        } else {
          return {
            timestamp: world.buildShipsStatus.readyTimestamp,
            happen: () => {
              return [
                createFleet(world.id, world.ownerId, world.buildShipsStatus.amount),
                stopBuildingShips(world.id),
              ];
            }
          }
        }
      })
    )
  }
}
