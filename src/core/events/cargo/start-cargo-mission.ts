import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { CargoProjector } from "../../projectors/cargo-projector";
import { FleetProjector } from "../../projectors/fleet-projector";
import { ReadyFleet, WaitingForCargoFleet } from "../../../shared/model/v1/fleet";
import { StartCargoMissionOrder } from "../../../shared/model/v1/fleet-orders";
import { TimeProjector } from "../../projectors/time-projector";
import { map } from "rxjs/operators";
import { GatesProjector } from "../../projectors/gates-projector";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { WorldProjector } from "../../projectors/world-projector";
import { cargoActions, cargoPresent } from "./cargo-helper";
import { GameSetupProvider } from "../../game-setup-provider";
import { worldhasOwner } from "../../../shared/model/v1/world";

@injectable()
export class StartCargoMissionEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private readonly cargo: CargoProjector,
    private readonly fleets: FleetProjector,
    private readonly time: TimeProjector,
    private readonly gates: GatesProjector,
    private readonly worlds: WorldProjector,
    private setup: GameSetupProvider
  ) {

    const readyFleetWithStarCargoMissionOrder$ = this.fleets.firstByStatusAndNextOrderType<ReadyFleet, StartCargoMissionOrder>('READY', 'START_CARGO_MISSION')

    this.upcomingEvent$ = combineLatest(
      readyFleetWithStarCargoMissionOrder$,
      this.time.currentTimestamp$,
      this.cargo.metalPotentialByPlayer$,
      this.cargo.populationPotentialByPlayer$,
      this.gates.all$,
      this.worlds.byId$
    ).pipe(
      map(([[fleet, order], timestamp, metalPotential, populationPotential, gates, worlds]) => {
        if (!fleet || !order) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              if (!gates[fleet.currentWorldId].includes(order.otherWorldId)) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              const otherWorld = worlds[order.otherWorldId];

              if (worldhasOwner(otherWorld) && otherWorld.ownerId !== fleet.ownerId) {
                return [
                  popFleetOrder(fleet.id)
                ]
              }

              return [
                popFleetOrder(fleet.id),
                ...cargoActions(
                  fleet.currentWorldId,
                  order.otherWorldId,
                  worlds,
                  metalPotential[fleet.ownerId],
                  populationPotential[fleet.ownerId],
                  fleet,
                  timestamp,
                  this.setup.rules.warping.warpToWorldDelay
                )
              ]
            }
          }
        }
      })
    );
  }



}