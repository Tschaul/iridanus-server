import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable, inject } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { ReadyWorld } from "../../../shared/model/v1/world";
import { BuildShipsOrder } from "../../../shared/model/v1/world-order";
import { map, withLatestFrom, tap } from "rxjs/operators";
import { popWorldOrder } from "../../actions/world/pop-world-order";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { buildShip } from "../../actions/world/build-ship";
import { GameSetupProvider } from "../../game-setup-provider";
import { decrementBuildOrderAmount } from "../../actions/world/decrement-build-order-amount";

@injectable()
export class BeginBuildingShipEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(private worlds: WorldProjector, private time: TimeProjector, private setup: GameSetupProvider) {
    this.upcomingEvent$ = combineLatest(
      worlds.firstByStatusAndNextOrderType<ReadyWorld, BuildShipsOrder>('READY', 'BUILD_SHIPS'),
      this.time.currentTimestamp$
    ).pipe(
      map(([[world, order], timestamp]) => {
        if (!world || !order) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              if (world.metal < 1 || world.industry === 0) {
                return [
                  popWorldOrder(world.id)
                ];
              } else {
                return [
                  buildShip(world.id, timestamp + this.setup.rules.building.buildShipDelay / Math.min(world.industry, world.population)),
                  giveOrTakeWorldMetal(world.id, -1),
                  decrementBuildOrderAmount(world.id, 'BUILD_SHIPS')
                ];
              }
            }
          }
        }
      })
    )
  }
}