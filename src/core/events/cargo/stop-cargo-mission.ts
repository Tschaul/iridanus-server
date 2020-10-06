import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { FleetProjector } from "../../projectors/fleet-projector";
import { WaitingForCargoFleet } from "../../../shared/model/v1/fleet";
import { TimeProjector } from "../../projectors/time-projector";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { worldHasOwner } from "../../../shared/model/v1/world";
import { fleetReady } from "../../actions/fleet/fleet-ready";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";

@injectable()
export class StopCargoMissionEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private readonly fleets: FleetProjector,
    private readonly worlds: WorldProjector,
    private readonly combat: CombatAndCaptureProjector
  ) {

    const waitingForCargoFleets = this.fleets.allByStatus<WaitingForCargoFleet>('WAITING_FOR_CARGO')

    this.upcomingEvent$ = combineLatest([
      waitingForCargoFleets,
      this.worlds.byId$,
      this.combat.playersAtWorldById$
    ]).pipe(
      map(([waitingFleets, worlds, playersAtWorld]) => {


        const otherPlayerAtWorld = (worldId: string, ownerId: string) => {
          return playersAtWorld[worldId]
            && playersAtWorld[worldId].length
            && !(playersAtWorld[worldId].length === 1 && playersAtWorld[worldId][0] === ownerId);
        }

        const fleet = waitingFleets.find(fleet => {
          if (fleet.orders[0]?.type === 'STOP_CARGO_MISSION') {
            return true;
          }

          const fromWorld = worlds[fleet.fromWorldId];
          const toWorld = worlds[fleet.toWorldId];

          return (worldHasOwner(fromWorld) && fromWorld.ownerId !== fleet.ownerId)
            || (worldHasOwner(toWorld) && toWorld.ownerId !== fleet.ownerId)
            || !!fleet.orders.length
            || otherPlayerAtWorld(fleet.fromWorldId, fleet.ownerId)
            || otherPlayerAtWorld(fleet.toWorldId, fleet.ownerId)

        }) ?? null

        if (!fleet) {
          return null
        } else {
          return {
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