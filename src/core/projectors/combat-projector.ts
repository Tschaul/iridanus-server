import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import 'reflect-metadata';
import { WorldProjector } from "./world-projector";
import { FleetProjector } from "./fleet-projector";
import { map, distinctUntilChanged } from "rxjs/operators";
import { Fleet, ReadyFleetBase, FiringFleet } from "../model/fleet";
import { World } from "../model/world";
import { fleetReady } from "../actions/fleet/fleet-ready";

@injectable()
export class CombatProjector {

  public worldIdsAtPeaceAndAtWar$: Observable<[string[], string[]]>;
  public firstFiringFleet$: Observable<(ReadyFleetBase & FiringFleet) | null>;

  constructor(
    private worlds: WorldProjector,
    private fleets: FleetProjector) {

    this.firstFiringFleet$ = fleets.byId$.pipe(
      map(fleetsById => {
        return (Object.values(fleetsById)
          .find(fleet =>
            fleet.status === 'READY'
            && fleet.combatStatus === 'FIRING'
          ) || null) as (ReadyFleetBase & FiringFleet) | null
      })
    )

    this.worldIdsAtPeaceAndAtWar$ = combineLatest(this.worlds.byId$, this.fleets.byId$).pipe(
      map(([worldsById, fleetsById]) => {

        const worlds = Object.values(worldsById);
        const fleets = Object.values(fleetsById);

        const playersAtWorldById = this.getPlayersAtWorldById(fleets, worlds);

        const combatWorldIds = Array.from(playersAtWorldById.entries()).filter(([worldId, players]) => {
          return players.length > 1;
        }).map(([worldId, _]) => worldId);

        const nonCombatWorldIds = Array.from(playersAtWorldById.entries()).filter(([worldId, players]) => {
          return players.length <= 1;
        }).map(([worldId, _]) => worldId);

        return [combatWorldIds, nonCombatWorldIds] as [string[], string[]];
      }),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    )


  }

  private getPlayersAtWorldById(fleets: Fleet[], worlds: World[]) {

    const fleetOwnersByWorldId = new Map<string, string[]>();

    for (const fleet of fleets) {
      if (fleet.status !== 'LOST' && fleet.status !== 'WARPING') {
        const value = fleetOwnersByWorldId.get(fleet.currentWorldId);
        if (!value) {
          fleetOwnersByWorldId.set(fleet.currentWorldId, [fleet.ownerId]);
        }
        else {
          if (value.indexOf(fleet.ownerId) === -1) {
            value.push(fleet.ownerId);
          }
        }
      }
    }

    for (const world of worlds) {
      if (world.status !== 'LOST') {
        const value = fleetOwnersByWorldId.get(world.id);
        if (!value) {
          fleetOwnersByWorldId.set(world.id, [world.ownerId]);
        }
        else {
          value.push(world.ownerId);
        }
      }
    }

    return fleetOwnersByWorldId;
  }
}