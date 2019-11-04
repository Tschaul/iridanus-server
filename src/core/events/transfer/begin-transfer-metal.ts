import { GameEvent } from "../event";
import { State } from "../../state";
import { PopOrderAction } from "../../actions/fleet/pop-order";
import { LeaveWorldAction } from "../../actions/fleet/leave-world";
import { Observable } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { WarpOrder, TransferMetalOrder } from "../../model/fleet-orders";
import { ReadyFleet } from "../../model/fleet";
import { Universe } from "../../model/universe";
import { universeHasGate } from "../../model/gate-helper";
import { World } from "../../model/world";
import { getTrueTransferAmount } from "./amount-helper";
import { TransferMetalAction } from "../../actions/fleet/transfer-metal";
import { GiveOrTakeWorldMetalAction } from "../../actions/world/give-or-take-metal";

export const TRANSFER_METAL_DELAY = 1000;

export function upcomingBeginTransferMetalEvent(state$: Observable<State>): Observable<GameEvent | null> {
  const readyFleetWithTransferMetalOrder$ = state$.pipe(
    map(state => {
      return state.universe.fleets
    }),
    // distinctUntilChanged(),
    map(fleets => {
      const fleet = Object.values(fleets).find(fleet => fleet.status === 'READY'
        && fleet.orders.length
        && fleet.orders[0].type === 'TRANSFER_METAL');
      return fleet as ReadyFleet | null;
    }));

  return readyFleetWithTransferMetalOrder$.pipe(
    withLatestFrom(state$),
    map(([fleet, state]) => {
      if (!fleet) {
        return null
      } else {
        const currentWorld = state.universe.worlds[fleet.currentWorldId];
        return new BeginTransferMetalEvent(
          fleet,
          currentWorld,
          fleet.orders[0] as TransferMetalOrder,
          state.currentTimestamp,
        )
      }
    }
    ));
}

export class BeginTransferMetalEvent implements GameEvent {

  constructor(
    private readonly fleet: ReadyFleet,
    private readonly world: World,
    private readonly order: TransferMetalOrder,
    public readonly timestamp: number,
  ) { }

  happen() {

    if (this.fleet.ownerId !== this.world.ownerId) {
      return [
        new PopOrderAction(this.fleet.id)
      ]
    }

    const trueAmount = getTrueTransferAmount(this.fleet.metal, this.world.metal, this.order.amount)

    if (trueAmount === 0) {
      return [
        new PopOrderAction(this.fleet.id)
      ]
    }
    
    return [
      new TransferMetalAction(this.fleet.id, trueAmount, this.timestamp + TRANSFER_METAL_DELAY),
      new GiveOrTakeWorldMetalAction(this.world.id, -1 * trueAmount),
      new PopOrderAction(this.fleet.id)
    ];
  }

}