import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { CargoProjector } from "../../projectors/cargo-projector";
import { FleetProjector } from "../../projectors/fleet-projector";
import { TransferingCargoFleet } from "../../../shared/model/v1/fleet";
import { TimeProjector } from "../../projectors/time-projector";
import { map } from "rxjs/operators";
import { GatesProjector } from "../../projectors/gates-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { cargoActions } from "./cargo-helper";
import { GameSetupProvider } from "../../game-setup-provider";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";

@injectable()
export class ContinueCargoMissionEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private readonly cargo: CargoProjector,
    private readonly fleets: FleetProjector,
    private readonly time: TimeProjector,
    private readonly gates: GatesProjector,
    private readonly worlds: WorldProjector,
    private setup: GameSetupProvider
  ) {

    const nextArrivingTransferingCargoFleet = this.fleets.firstByStatusAndTimestamp<TransferingCargoFleet>('TRANSFERING_CARGO', 'arrivingTimestamp')

    this.upcomingEvent$ = combineLatest(
      nextArrivingTransferingCargoFleet,
      this.cargo.metalPotentialByPlayer$,
      this.cargo.populationPotentialByPlayer$,
      this.worlds.byId$
    ).pipe(
      map(([fleet, metalPotential, populationPotential, worlds]) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.arrivingTimestamp,
            happen: () => {

              // reverse direction
              const fromWorldId = fleet.toWorldId;
              const toWorldId = fleet.fromWorldId;

              return [
                giveOrTakeWorldMetal(fleet.toWorldId,fleet.cargoMetal),
                giveOrTakeWorldPopulation(fleet.toWorldId,fleet.cargoPopulation),
                ...cargoActions(
                  fromWorldId,
                  toWorldId,
                  worlds,
                  metalPotential[fleet.ownerId],
                  populationPotential[fleet.ownerId],
                  fleet,
                  fleet.arrivingTimestamp,
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