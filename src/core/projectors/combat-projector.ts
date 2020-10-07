import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "./world-projector";
import { FleetProjector } from "./fleet-projector";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { Fleet, ReadyFleetBase, FiringFleet, fleetIsAtWorld } from "../../shared/model/v1/fleet";
import { FiringWorld, WorldWithOwner } from "../../shared/model/v1/world";
import equal from 'deep-equal';

@injectable()
export class CombatProjector {

  public worldIdsAtPeaceAndAtWar$: Observable<[string[], string[]]>;
  public playersAtWorldById$: Observable<{ [k: string]: string[] }>;

  public nextFiringFleet$: Observable<(ReadyFleetBase & FiringFleet) | null>;
  public nextFiringWorld$: Observable<(WorldWithOwner & FiringWorld) | null>;

  constructor(
    private fleets: FleetProjector) {

    this.nextFiringFleet$ = fleets.byId$.pipe(
      map(fleetsById => {
        return (Object.values(fleetsById)
          .filter(fleet =>
            fleet.status === 'READY'
            && fleet.combatStatus === 'FIRING'
          ) as Array<(ReadyFleetBase & FiringFleet)>)
          .sort((a, b) =>
            a.weaponsReadyTimestamp - b.weaponsReadyTimestamp
          )[0] || null
      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.playersAtWorldById$ = this.fleets.byId$.pipe(
      map((fleetsById) => {

        const fleets = Object.values(fleetsById);

        return this.getPlayersAtWorldById(fleets);
      }),
      shareReplay(1)
    );

    this.worldIdsAtPeaceAndAtWar$ = this.playersAtWorldById$.pipe(
      map((playersAtWorldById) => {

        const combatWorldIds = Object.entries(playersAtWorldById).filter(([_, players]) => {
          return players.length > 1;
        }).map(([worldId, _]) => worldId);

        const nonCombatWorldIds = Object.entries(playersAtWorldById).filter(([_, players]) => {
          return players.length <= 1;
        }).map(([worldId, _]) => worldId);

        return [combatWorldIds, nonCombatWorldIds] as [string[], string[]];
      }),
      shareReplay(1)
    )
  }

  private getPlayersAtWorldById(fleets: Fleet[]): { [k: string]: string[] } {

    const playersByWorldId: { [k: string]: string[] } = {};

    for (const fleet of fleets) {
      if (fleetIsAtWorld(fleet)) {
        const value = playersByWorldId[fleet.currentWorldId];
        if (!value) {
          playersByWorldId[fleet.currentWorldId] = [fleet.ownerId];
        }
        else if (value.indexOf(fleet.ownerId) === -1) {
          value.push(fleet.ownerId);
        }
      }
    }

    // for (const world of worlds) {
    //   if (worldHasOwner(world)) {
    //     const value = playersByWorldId[world.id];
    //     if (!value) {
    //       playersByWorldId[world.id] = [world.ownerId];
    //     }
    //     else if (value.indexOf(world.ownerId) === -1) {
    //       value.push(world.ownerId);
    //     }
    //   }
    // }

    return playersByWorldId;
  }
}