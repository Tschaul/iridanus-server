import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "./world-projector";
import { FleetProjector } from "./fleet-projector";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { Fleet, ReadyFleetBase, FiringFleet, LostFleet } from "../../shared/model/v1/fleet";
import { World, FiringWorld, ReadyWorldBase, LostWorld } from "../../shared/model/v1/world";

@injectable()
export class CombatAndCaptureProjector {

  public worldIdsAtPeaceAndAtWar$: Observable<[string[], string[]]>;
  public playersAtWorldById$: Observable<{ [k: string]: string[] }>;

  public nextFiringFleet$: Observable<(ReadyFleetBase & FiringFleet) | null>;
  public nextFiringWorld$: Observable<(ReadyWorldBase & FiringWorld) | null>;

  public nextCapturedWorld$: Observable<[LostWorld | null, string]>;
  public nextCapturedFleet$: Observable<[LostFleet | null, string]>;

  constructor(
    private worlds: WorldProjector,
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
      })
    )

    this.nextFiringWorld$ = worlds.byId$.pipe(
      map(worldsById => {
        return (Object.values(worldsById)
          .filter(world =>
            world.status === 'READY'
            && world.combatStatus === 'FIRING'
          ) as Array<(ReadyWorldBase & FiringWorld)>)
          .sort((a, b) =>
            a.weaponsReadyTimestamp - b.weaponsReadyTimestamp
          )[0] || null
      })
    )

    this.playersAtWorldById$ = combineLatest(this.worlds.byId$, this.fleets.byId$).pipe(
      map(([worldsById, fleetsById]) => {

        const worlds = Object.values(worldsById);
        const fleets = Object.values(fleetsById);

        return this.getPlayersAtWorldById(fleets, worlds);
      }),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
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
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    )

    this.nextCapturedFleet$ = combineLatest(this.fleets.byId$, this.playersAtWorldById$).pipe(
      map(([fleetsById, playersAtWorldById]) => {
        const lostFleets = Object.values(fleetsById).filter(fleet => fleet.status === 'LOST') as LostFleet[];
        const capturedFleet = lostFleets.find(fleet => {
          return playersAtWorldById[fleet.currentWorldId].length === 1;
        });
        if (capturedFleet) {
          return [capturedFleet, playersAtWorldById[capturedFleet.currentWorldId][0]]
        } else {
          return [null, '']
        }
      })
    )

    this.nextCapturedWorld$ = combineLatest(this.worlds.byId$, this.playersAtWorldById$).pipe(
      map(([worldsById, playersAtWorldById]) => {
        const lostWorlds = Object.values(worldsById).filter(fleet => fleet.status === 'LOST') as LostWorld[];
        const capturedFleet = lostWorlds.find(world => {
          return playersAtWorldById[world.id].length === 1;
        });
        if (capturedFleet) {
          return [capturedFleet, playersAtWorldById[capturedFleet.id][0]]
        } else {
          return [null, '']
        }
      })
    )
  }

  private getPlayersAtWorldById(fleets: Fleet[], worlds: World[]): { [k: string]: string[] } {

    const fleetOwnersByWorldId: { [k: string]: string[] } = {};

    for (const fleet of fleets) {
      if (fleet.status !== 'LOST' && fleet.status !== 'WARPING') {
        const value = fleetOwnersByWorldId[fleet.currentWorldId];
        if (!value) {
          fleetOwnersByWorldId[fleet.currentWorldId] = [fleet.ownerId];
        }
        else if (value.indexOf(fleet.ownerId) === -1) {
          value.push(fleet.ownerId);
        }
      }
    }

    for (const world of worlds) {
      if (world.status !== 'LOST') {
        const value = fleetOwnersByWorldId[world.id];
        if (!value) {
          fleetOwnersByWorldId[world.id] = [world.ownerId];
        }
        else if (value.indexOf(world.ownerId) === -1) {
          value.push(world.ownerId);
        }
      }
    }

    return fleetOwnersByWorldId;
  }
}