import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { CONFIG, GameConfig } from "../../config";
import { ReadyWorld } from "../../model/world";
import { BuildIndustryOrder } from "../../model/world-order";
import { map, withLatestFrom, tap } from "rxjs/operators";
import { popWorldOrder } from "../../actions/world/pop-world-order";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { buildIndustry } from "../../actions/world/build-industry";

@injectable()
export class BeginBuildingIndustryEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(private worlds: WorldProjector, private time: TimeProjector, @inject(CONFIG) private config: GameConfig) {
    this.upcomingEvent$ = worlds.firstByStatusAndNextOrderType<ReadyWorld, BuildIndustryOrder>('READY', 'BUILD_INDUSTRY').pipe(
      withLatestFrom(this.time.currentTimestamp$),
      map(([[world, order], timestamp]) => {
        if (!world || !order) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              if (world.metal < this.config.building.buildIndustryCost) {
                return [
                  popWorldOrder(world.id)
                ];
              } else {
                return [
                  buildIndustry(world.id, timestamp + this.config.building.buildIndustryDelay / Math.min(world.industry, world.population)),
                  giveOrTakeWorldMetal(world.id, -1 * this.config.building.buildIndustryCost),
                  popWorldOrder(world.id)
                ];
              }
            }
          }
        }
      })
    )
  }
}