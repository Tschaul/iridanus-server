import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { FleetProjector } from "../../projectors/fleet-projector";
import { WaitingForCargoFleet } from "../../../shared/model/v1/fleet";
import { TimeProjector } from "../../projectors/time-projector";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { worldhasOwner } from "../../../shared/model/v1/world";
import { fleetReady } from "../../actions/fleet/fleet-ready";

@injectable()
export class StopCargoMissionEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private readonly fleets: FleetProjector,
    private readonly time: TimeProjector,
    private readonly worlds: WorldProjector,
  ) {

    const readyFleetWithStarCargoMissionOrder$ = this.fleets.allByStatus<WaitingForCargoFleet>('WAITING_FOR_CARGO')

    this.upcomingEvent$ = combineLatest(
      readyFleetWithStarCargoMissionOrder$,
      this.time.currentTimestamp$,
      this.worlds.byId$
    ).pipe(
      map(([waitingFleets, timestamp, worlds]) => {

        const fleet = waitingFleets.find(fleet => {
          const fromWorld = worlds[fleet.fromWorldId];
          const toWorld = worlds[fleet.toWorldId];
          return (worldhasOwner(fromWorld) && fromWorld.ownerId !== fleet.ownerId)
            || (worldhasOwner(toWorld) && toWorld.ownerId !== fleet.ownerId)
        }) ?? null

        if (!fleet) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {

              return [
                fleetReady(fleet.id)
              ]
            }
          }
        }
      })
    );
  }



}