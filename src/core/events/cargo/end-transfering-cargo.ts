import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { FleetProjector } from "../../projectors/fleet-projector";
import { TransferingCargoFleet } from "../../../shared/model/v1/fleet";
import { map } from "rxjs/operators";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { waitForCargo } from "../../actions/fleet/wait-for-cargo";
import { fleetReady } from "../../actions/fleet/fleet-ready";

@injectable()
export class EndTransferingCargoEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private readonly fleets: FleetProjector,
  ) {

    const nextArrivingTransferingCargoFleet$ = this.fleets.firstByStatusAndTimestamp<TransferingCargoFleet>('TRANSFERING_CARGO', 'arrivingTimestamp')

    this.upcomingEvent$ = nextArrivingTransferingCargoFleet$.pipe(
      map((fleet) => {
        if (!fleet) {
          return null
        } else {
          return {
            timestamp: fleet.arrivingTimestamp,
            happen: () => {

              return [
                giveOrTakeWorldMetal(fleet.toWorldId, fleet.cargoMetal),
                giveOrTakeWorldPopulation(fleet.toWorldId, fleet.cargoPopulation),
                waitForCargo(fleet.id, fleet.fromWorldId, fleet.toWorldId)
              ]
            }
          }
        }
      })
    );
  }



}