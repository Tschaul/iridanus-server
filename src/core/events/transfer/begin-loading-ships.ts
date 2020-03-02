import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { ReadyFleetBase, ReadyFleet } from "../../../shared/model/v1/fleet";
import { getTrueTransferAmount } from "./amount-helper";
import { injectable, inject } from "inversify";
import { FleetProjector } from "../../projectors/fleet-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { LoadShipsOrder } from "../../../shared/model/v1/fleet-orders";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { giveOrTakeWorldShips } from "../../actions/world/give-or-take-ships";
import { loadShips } from "../../actions/fleet/load-ships";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class BeginLoadingShipsEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector, 
    private worlds: WorldProjector, 
    private time: TimeProjector, 
    private setup: GameSetupProvider
  ) {

    const readyFleetWithTransferShipsOrder$ = this.fleets.firstByStatusAndNextOrderType<ReadyFleet, LoadShipsOrder>('READY','LOAD_SHIPS')

    this.upcomingEvent$ = readyFleetWithTransferShipsOrder$.pipe(
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
          
              const trueAmount = getTrueTransferAmount(fleet.ships, world.ships, order.amount)
          
              if (trueAmount === 0) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }
          
              return [
                loadShips(fleet.id, trueAmount, timestamp + this.setup.rules.transfering.transferShipsDelay),
                giveOrTakeWorldShips(world.id, -1 * trueAmount),
                popFleetOrder(fleet.id)
              ];
            }
          }
        }
      }
      ));
  }
}
