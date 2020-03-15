import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map, withLatestFrom } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { fleetStopFiring } from "../../actions/fleet/stop-firing";
import { WorldProjector } from "../../projectors/world-projector";
import { AwaitCaptureOrder } from "../../../shared/model/v1/fleet-orders";
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import { worldhasOwner } from "../../../shared/model/v1/world";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";

@injectable()
export class AwaitedCaptureEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private fleets: FleetProjector,
    private worlds: WorldProjector,
    private time: TimeProjector) {

    const awaitedCaputureFleet$ = combineLatest(
      this.fleets.allByStatusAndNextOrderType<ReadyFleet, AwaitCaptureOrder>("READY", "AWAIT_CAPTURE"),
      this.worlds.byId$
    ).pipe(
      map(([waitingFleets, worldsById]) => {
        return waitingFleets.find(fleet => {
          const world = worldsById[fleet.currentWorldId];
          return worldhasOwner(world) && world.ownerId === fleet.ownerId;
        }) || null
      })
    )

    this.upcomingEvent$ = combineLatest(
      awaitedCaputureFleet$,
      this.time.currentTimestamp$
    ).pipe(
      map(([fleet, timestamp]) => {
        if (!fleet) {
          return null;
        }
        return {
          timestamp,
          happen: () => {
            return [
              popFleetOrder(fleet.id)
            ]
          }
        }
      })
    )
  }

}