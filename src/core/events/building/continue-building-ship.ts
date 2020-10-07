import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { BuildingShipsWorld, worldHasOwner, WorldWithOwner } from "../../../shared/model/v1/world";
import { map } from "rxjs/operators";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { buildShips } from "../../actions/world/build-ship";
import { GameSetupProvider } from "../../game-setup-provider";
import { calculateActiveIndustry } from "./build-helper";
import { stopBuildingShips } from "../../actions/world/stop-building-ships";

@injectable()
export class ContinueOrStopBuildingShipEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(private worlds: WorldProjector, private setup: GameSetupProvider) {

    
    const continueBuildingShipsWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world => {
          if (worldHasOwner(world)) {
            const activeIndustry = Math.min(world.population[world.ownerId], world.industry)
            if (world.buildShipsStatus.type === 'BUILDING_SHIPS' && activeIndustry !== world.buildShipsStatus.activeIndustry) {
              return true
            }
          }
        }) as WorldWithOwner & {buildShipsStatus: BuildingShipsWorld}

      })
    )

    this.upcomingEvent$ = continueBuildingShipsWorld$.pipe(
      map((world) => {

        if (!world) {
          return null
        } else {
          return {
            happen: (timestamp: number) => {

              const activeIndustry = calculateActiveIndustry(world);

              if (activeIndustry !== 0) {

                const newDelay = this.setup.rules.building.buildShipDelay * world.buildShipsStatus.amount / activeIndustry;

                const currentlyBuildingIndustry = world.buildShipsStatus.activeIndustry;

                const oldDelay = this.setup.rules.building.buildShipDelay * world.buildShipsStatus.amount / currentlyBuildingIndustry;

                const progress = (timestamp - (world.buildShipsStatus.readyTimestamp - oldDelay)) / (oldDelay);

                const adjustedNewDelay = newDelay * (1 - progress)

                return [
                  buildShips(world.id, timestamp + adjustedNewDelay, world.buildShipsStatus.amount, activeIndustry),
                ];
              } else {

                return [
                  stopBuildingShips(world.id),
                  giveOrTakeWorldMetal(world.id, world.buildShipsStatus.amount),
                ]
              }
            }
          }
        }
      })
    )
  }
}