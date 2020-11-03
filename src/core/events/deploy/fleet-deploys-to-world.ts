import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import { DeployToWorldOrder } from "../../../shared/model/v1/fleet-orders";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { WorldProjector } from "../../projectors/world-projector";
import { worldHasOwner } from "../../../shared/model/v1/world";
import { giveOrTakeWorldIndustry } from "../../actions/world/give-or-take-industry";
import { looseFleet } from "../../actions/fleet/loose-fleet";

@injectable()
export class FleetDeploysToWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public fleets: FleetProjector,
    public worlds: WorldProjector
  ) {
    this.upcomingEvent$ = combineLatest([
      this.fleets.firstByStatusAndNextOrderType<ReadyFleet, DeployToWorldOrder>('READY', 'DEPLOY_TO_WORLD'),
      this.worlds.byId$
    ]).pipe(
      map(([[fleet, order], worldsById]) => {
        if (!fleet) {
          return null
        } else {
          return {
            happen: () => {

              const world = worldsById[fleet.currentWorldId];

              if (!worldHasOwner(world) || world.ownerId !== fleet.ownerId || order?.worldId !== fleet.currentWorldId || ['VOID', 'NEBULA'].includes(world.worldType.type)) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              return [
                popFleetOrder(fleet.id),
                giveOrTakeWorldIndustry(world.id, fleet.ships),
                looseFleet(fleet.id),
              ];
            }
          }
        }
      }))
  }
}
