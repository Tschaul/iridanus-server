import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { FleetProjector } from "../../projectors/fleet-projector";
import { TransferingCargoFleet } from "../../../shared/model/v1/fleet";
import { map } from "rxjs/operators";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { waitForCargo } from "../../actions/fleet/wait-for-cargo";
import { fleetReady } from "../../actions/fleet/fleet-ready";
import { WorldProjector } from "../../projectors/world-projector";
import { worldhasOwner } from "../../../shared/model/v1/world";
import { transferCargoToWorld } from "../../actions/fleet/transfer-cargo-to-world";
import { GameSetupProvider } from "../../game-setup-provider";
import { Action } from "../../actions/action";
import { captureWorld } from "../../actions/world/capture";

@injectable()
export class EndTransferingCargoEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private readonly fleets: FleetProjector,
    private readonly worlds: WorldProjector,
    private setup: GameSetupProvider
  ) {

    const nextArrivingTransferingCargoFleet$ = this.fleets.firstByStatusAndTimestamp<TransferingCargoFleet>('TRANSFERING_CARGO', 'arrivingTimestamp')

    this.upcomingEvent$ = combineLatest([
      nextArrivingTransferingCargoFleet$,
      this.worlds.byId$
    ]).pipe(
      map(([fleet, worldsById]) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.arrivingTimestamp,
            happen: () => {

              const world = worldsById[fleet.toWorldId]

              if (worldhasOwner(world) && world.ownerId !== fleet.ownerId) {

                const arrivingTimestamp = fleet.arrivingTimestamp + this.setup.rules.warping.warpToWorldDelay;

                return [
                  transferCargoToWorld(fleet.id, arrivingTimestamp, fleet.cargoMetal, fleet.cargoPopulation, fleet.fromWorldId)
                ]
              }

              let captureAction: Action[] = []

              if (!worldhasOwner(world) && fleet.cargoPopulation > 0) {
                captureAction = [
                  captureWorld(world.id, fleet.ownerId)
                ]
              }

              return [
                giveOrTakeWorldMetal(fleet.toWorldId, fleet.cargoMetal),
                giveOrTakeWorldPopulation(fleet.toWorldId, fleet.cargoPopulation),
                ...captureAction,
                waitForCargo(fleet.id, fleet.fromWorldId, fleet.toWorldId),
              ]
            }
          }
        }
      })
    );
  }



}