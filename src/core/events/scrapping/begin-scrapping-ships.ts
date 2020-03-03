import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import { getTrueScrappigAmount } from "./amount-helper";
import { injectable } from "inversify";
import { FleetProjector } from "../../projectors/fleet-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { ScrapShipsForIndustryOrder } from "../../../shared/model/v1/fleet-orders";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { GameSetupProvider } from "../../game-setup-provider";
import { giveOrTakeFleetShips } from "../../actions/fleet/give-or-take-ships";
import { scrapShips } from "../../actions/fleet/scrap-ships";

@injectable()
export class BeginScrappingShipsEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector, 
    private worlds: WorldProjector, 
    private time: TimeProjector, 
    private setup: GameSetupProvider) {

    const readyFleetWithScrapShipsOrder$ = this.fleets.firstByStatusAndNextOrderType<ReadyFleet, ScrapShipsForIndustryOrder>('READY', 'SCRAP_SHIPS_FOR_INDUSTRY')

    this.upcomingEvent$ = readyFleetWithScrapShipsOrder$.pipe(
      withLatestFrom(this.worlds.byId$, this.time.currentTimestamp$),
      map(([[fleet, order], worlds, timestamp]) => {
        if (!fleet || !order) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              const world = worlds[fleet.currentWorldId];

              if (world.status === 'LOST' || fleet.ownerId !== world.ownerId) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              let trueAmount = getTrueScrappigAmount(world.ships, fleet.ships, order.amount, this.setup.rules.scrapping.shipsPerIndustry, this.setup.rules.global.maxAmount)

              if (trueAmount === 0) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              return [
                scrapShips(fleet.id, trueAmount, timestamp + this.setup.rules.scrapping.scrappingDelay),
                giveOrTakeFleetShips(fleet.id, -1 * this.setup.rules.scrapping.shipsPerIndustry * trueAmount),
                popFleetOrder(fleet.id)
              ];
            }
          }
        }
      }
      ));
  }
}
