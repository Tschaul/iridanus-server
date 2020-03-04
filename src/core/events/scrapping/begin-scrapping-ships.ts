import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyWorld } from "../../../shared/model/v1/world";
import { getTrueScrappigAmount } from "./amount-helper";
import { injectable } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { popWorldOrder } from "../../actions/world/pop-world-order";
import { GameSetupProvider } from "../../game-setup-provider";
import { giveOrTakeWorldShips } from "../../actions/world/give-or-take-ships";
import { scrapShips } from "../../actions/world/scrap-ships";
import { decrementBuildOrderAmount } from "../../actions/world/decrement-build-order-amount";
import { ScrapShipsForIndustryOrder } from "../../../shared/model/v1/world-order";

@injectable()
export class BeginScrappingShipsEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private time: TimeProjector,
    private setup: GameSetupProvider) {

    const readyWorldWithScrapShipsOrder$ = this.worlds.firstByStatusAndNextOrderType<ReadyWorld, ScrapShipsForIndustryOrder>('READY', 'SCRAP_SHIPS_FOR_INDUSTRY')

    this.upcomingEvent$ = combineLatest(
      readyWorldWithScrapShipsOrder$,
      this.time.currentTimestamp$
    ).pipe(
      map(([[world, order], timestamp]) => {
        if (!world || !order) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {

              let trueAmount = getTrueScrappigAmount(world.ships, world.ships, 1, this.setup.rules.scrapping.shipsPerIndustry, this.setup.rules.global.maxAmount)

              if (trueAmount === 0) {
                return [
                  popWorldOrder(world.id)
                ]
              }

              return [
                scrapShips(world.id, trueAmount, timestamp + this.setup.rules.scrapping.scrappingDelay),
                giveOrTakeWorldShips(world.id, -1 * this.setup.rules.scrapping.shipsPerIndustry * trueAmount),
                decrementBuildOrderAmount(world.id, 'SCRAP_SHIPS_FOR_INDUSTRY')
              ];
            }
          }
        }
      }
      ));
  }
}
