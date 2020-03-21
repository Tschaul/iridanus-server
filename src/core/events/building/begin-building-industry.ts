import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable, inject } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { ReadyWorld } from "../../../shared/model/v1/world";
import { BuildIndustryOrder } from "../../../shared/model/v1/world-order";
import { map, withLatestFrom, tap } from "rxjs/operators";
import { popWorldOrder } from "../../actions/world/pop-world-order";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { buildIndustry } from "../../actions/world/build-industry";
import { GameSetupProvider } from "../../game-setup-provider";
import { decrementBuildOrderAmount } from "../../actions/world/decrement-build-order-amount";

@injectable()
export class BeginBuildingIndustryEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(private worlds: WorldProjector, private time: TimeProjector, private setup: GameSetupProvider) {
    this.upcomingEvent$ = combineLatest(
      worlds.firstByStatusAndNextOrderType<ReadyWorld, BuildIndustryOrder>('READY', 'BUILD_INDUSTRY'),
      this.time.currentTimestamp$
    ).pipe(
      map(([[world, order], timestamp]) => {
        if (!world || !order) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              const availableIndustry = Math.min(world.industry, world.population - world.mines)
              if (
                world.metal < this.setup.rules.building.buildIndustryCost
                || world.industry === 0
                || availableIndustry < 1
              ) {
                return [
                  popWorldOrder(world.id)
                ];
              } else {
                return [
                  buildIndustry(world.id, timestamp + this.setup.rules.building.buildIndustryDelay / availableIndustry),
                  giveOrTakeWorldMetal(world.id, -1 * this.setup.rules.building.buildIndustryCost),
                  decrementBuildOrderAmount(world.id, 'BUILD_INDUSTRY')
                ];
              }
            }
          }
        }
      })
    )
  }
}