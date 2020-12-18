import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { CargoProjector } from "../../projectors/cargo-projector";
import { FleetProjector } from "../../projectors/fleet-projector";
import { WaitingForCargoFleet } from "../../../shared/model/v1/fleet";
import { TimeProjector } from "../../projectors/time-projector";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { cargoAmounts } from "./cargo-helper";
import { GameSetupProvider } from "../../game-setup-provider";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { transferCargoToWorld } from "../../actions/fleet/transfer-cargo-to-world";
import { World, worldHasOwner, WorldWithOwner } from "../../../shared/model/v1/world";
import { finalDestinationOfRoute, firstDestinationOfRoute } from "./cargo-route-helpers";

@injectable()
export class BeginTransferingCargoEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private readonly cargo: CargoProjector,
    private readonly fleets: FleetProjector,
    private readonly time: TimeProjector,
    private readonly worlds: WorldProjector,
    private setup: GameSetupProvider
  ) {

    const readyFleetWithStarCargoMissionOrder$ = this.fleets.allByStatus<WaitingForCargoFleet>('WAITING_FOR_CARGO')

    this.upcomingEvent$ = combineLatest([
      readyFleetWithStarCargoMissionOrder$,
      this.cargo.metalPotentialByPlayer$,
      this.worlds.byId$
    ]).pipe(
      map(([waitingFleets, metalPotential, worlds]) => {

        const fleet = waitingFleets.find(fleet => {

          if (!metalPotential[fleet.ownerId]) {
            return false;
          }

          const worldFrom = worlds[fleet.currentWorldId]
          const worldTo = worlds[finalDestinationOfRoute(fleet.currentWorldId, fleet.cargoRoute)]

          const cargo = cargoAmounts(
            worldFrom,
            worldTo,
            metalPotential[fleet.ownerId],
            fleet.ships,
            fleet.ownerId
          )

          const reverseCargo = cargoAmounts(
            worldTo,
            worldFrom,
            metalPotential[fleet.ownerId],
            fleet.ships,
            fleet.ownerId
          )

          return cargo.population !== 0 || cargo.metal !== 0 || reverseCargo.population !== 0 || reverseCargo.metal !== 0

        }) ?? null

        if (!fleet) {
          return null
        } else {
          return {
            happen: (timestamp: number) => {

              const worldFrom = worlds[fleet.currentWorldId]
              const worldTo = worlds[finalDestinationOfRoute(fleet.currentWorldId, fleet.cargoRoute)]

              const cargo = cargoAmounts(
                worldFrom,
                worldTo,
                metalPotential[fleet.ownerId],
                fleet.ships,
                fleet.ownerId
              )

              const arrivingTimestamp = timestamp + this.setup.rules.warping.warpToWorldDelay

              const nextWorldId = firstDestinationOfRoute(fleet.currentWorldId, fleet.cargoRoute)

              return [
                giveOrTakeWorldMetal(fleet.currentWorldId, -1 * cargo.metal),
                giveOrTakeWorldPopulation(fleet.currentWorldId, -1 * cargo.population, fleet.ownerId),
                transferCargoToWorld(fleet.id, arrivingTimestamp, cargo.metal, cargo.population, nextWorldId, fleet.cargoRoute)
              ]
            }
          }
        }
      })
    );
  }



}