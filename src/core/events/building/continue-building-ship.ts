import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { BuildingShipsWorld } from "../../../shared/model/v1/world";
import { map } from "rxjs/operators";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { buildShips } from "../../actions/world/build-ship";
import { GameSetupProvider } from "../../game-setup-provider";
import { calculateActiveIndustry } from "./build-helper";
import { worldReady } from "../../actions/world/world-ready";

@injectable()
export class ContinueOrStopBuildingShipEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(worlds: WorldProjector, private setup: GameSetupProvider) {
    this.upcomingEvent$ = worlds.allByStatus<BuildingShipsWorld>('BUILDING_SHIPS').pipe(
      map((worlds) => {
        const world = worlds.find(world => {
          const activeIndustry = calculateActiveIndustry(world);
          const currentlyBuildingIndustry = world.buildingShipsActiveIndustry
          return activeIndustry !== currentlyBuildingIndustry;
        })

        if (!world) {
          return null
        } else {
          return {
            happen: (timestamp: number) => {

              const activeIndustry = calculateActiveIndustry(world);

              if (activeIndustry !== 0) {

                const newDelay = this.setup.rules.building.buildShipDelay * world.buildingShipsAmount / activeIndustry;

                const currentlyBuildingIndustry = world.buildingShipsActiveIndustry;

                const oldDelay = this.setup.rules.building.buildShipDelay * world.buildingShipsAmount / currentlyBuildingIndustry;

                const progress = (timestamp - (world.readyTimestamp - oldDelay)) / (oldDelay);

                const adjustedNewDelay = newDelay * (1 - progress)

                return [
                  buildShips(world.id, timestamp + adjustedNewDelay, world.buildingShipsAmount, activeIndustry),
                ];
              } else {

                return [
                  worldReady(world.id),
                  giveOrTakeWorldMetal(world.id, world.buildingShipsAmount),
                ]
              }
            }
          }
        }
      })
    )
  }
}