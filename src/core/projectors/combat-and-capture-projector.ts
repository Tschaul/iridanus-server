import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "./world-projector";
import { FleetProjector } from "./fleet-projector";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { Fleet, ReadyFleetBase, FiringFleet, LostFleet, fleetHasOwner, FleetWithOwnerAtWorld, fleetIsAtWorldAndHasOwner } from "../../shared/model/v1/fleet";
import { World, FiringWorld, WorldWithOwner, worldhasOwner, WorldBeingCaptured } from "../../shared/model/v1/world";
import equal from 'deep-equal';

@injectable()
export class CombatAndCaptureProjector {

  public worldIdsAtPeaceAndAtWar$: Observable<[string[], string[]]>;
  public playersAtWorldById$: Observable<{ [k: string]: string[] }>;

  public nextFiringFleet$: Observable<(ReadyFleetBase & FiringFleet) | null>;
  public nextFiringWorld$: Observable<(WorldWithOwner & FiringWorld) | null>;

  public nextCapturedWorld$: Observable<[(World & WorldBeingCaptured) | null, string]>;
  public nextStartCapturingWorld$: Observable<[World | null, string]>;
  public nextStopCapturingWorld$: Observable<World | null>;
  public nextCapturedFleet$: Observable<[LostFleet | null, string]>;
  public nextLostFleet$: Observable<Fleet | null>;

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
      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.nextFiringWorld$ = worlds.byId$.pipe(
      map(worldsById => {
        return (Object.values(worldsById)
          .filter(world =>
            'combatStatus' in world
            && world.combatStatus === 'FIRING'
          ) as Array<(WorldWithOwner & FiringWorld)>)
          .sort((a, b) =>
            a.weaponsReadyTimestamp - b.weaponsReadyTimestamp
          )[0] || null
      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.playersAtWorldById$ = combineLatest(this.worlds.byId$, this.fleets.byId$).pipe(
      map(([worldsById, fleetsById]) => {

        const worlds = Object.values(worldsById);
        const fleets = Object.values(fleetsById);

        return this.getPlayersAtWorldById(fleets, worlds);
      }),
      distinctUntilChanged(equal),
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
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.nextCapturedFleet$ = combineLatest(this.fleets.byId$, this.playersAtWorldById$).pipe(
      map(([fleetsById, playersAtWorldById]) => {
        const lostFleets = Object.values(fleetsById).filter(fleet => fleet.status === 'LOST') as LostFleet[];
        const capturedLostFleet = lostFleets.find(fleet => {
          const players = playersAtWorldById[fleet.currentWorldId] || [];
          return players.length === 1;
        });
        if (capturedLostFleet) {
          return [capturedLostFleet, playersAtWorldById[capturedLostFleet.currentWorldId][0]]
        }

        return [null, '']

      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.nextLostFleet$ = combineLatest(this.fleets.byId$, this.fleets.byCurrentWorldId$, this.worlds.byId$).pipe(
      map(([fleetsById, fleetsByWorldId, worldsById]) => {

        const ownedFleetsWithoutShips = Object.values(fleetsById).filter(fleet => fleet.ships === 0 && fleetIsAtWorldAndHasOwner(fleet)) as FleetWithOwnerAtWorld[];
        const lostOwnedFleet = ownedFleetsWithoutShips.find(fleet => {
          const noOtherFleetsAtWorld = !(fleetsByWorldId[fleet.currentWorldId] || []).some(otherFleet => otherFleet.ships !== 0 && fleetHasOwner(otherFleet) && otherFleet.ownerId === fleet.ownerId)
          const world = worldsById[fleet.currentWorldId];
          const worldIsNotOwned = !worldhasOwner(world) || world.ownerId !== fleet.ownerId;
          return noOtherFleetsAtWorld && worldIsNotOwned;
        });
        if (lostOwnedFleet) {
          return lostOwnedFleet;
        }

        return null

      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.nextStartCapturingWorld$ = combineLatest(this.worlds.byId$, this.playersAtWorldById$, this.fleets.byCurrentWorldId$).pipe(
      map(([worldsById, playersAtWorldById, fleetsByWorldId]) => {
        const worldsNotBeingCaptured = Object.values(worldsById).filter(world => world.captureStatus === 'NOT_BEING_CAPTURED');
        
        const lostWorlds = worldsNotBeingCaptured.filter(world => world.status === 'LOST') as World[];
        const capturedLostWorld = lostWorlds.find(world => {
          const players = playersAtWorldById[world.id] || [];
          return players.length === 1;
        });

        if (capturedLostWorld) {
          return [capturedLostWorld, playersAtWorldById[capturedLostWorld.id][0]]
        }

        const ownedWorlds = worldsNotBeingCaptured.filter(world => worldhasOwner(world)) as WorldWithOwner[];
        const capturedOwnedWorld = ownedWorlds.find(world => {
          const players = playersAtWorldById[world.id] || [];
          const noOtherOwner = players.filter(id => id !== world.ownerId).length === 1;
          const noFleetsAtWorld = !(fleetsByWorldId[world.id] || []).some(fleet => fleet.ships !== 0 && fleetHasOwner(fleet) && fleet.ownerId === world.ownerId)
          return world.ships === 0 && noOtherOwner && noFleetsAtWorld;
        });

        if (capturedOwnedWorld) {
          return [capturedOwnedWorld, playersAtWorldById[capturedOwnedWorld.id].find(id => id !== capturedOwnedWorld.ownerId) || '']
        }

        return [null, '']

      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.nextStopCapturingWorld$ = combineLatest([
      this.worlds.byId$,
      this.playersAtWorldById$,
    ]).pipe(
      map(([worldsbyId, playersAtWorldById]) => {
        const worldsBeingCaptured = Object.values(worldsbyId).filter(world => world.captureStatus === 'BEING_CAPTURED') as (World & WorldBeingCaptured)[]

        const nextWorld = worldsBeingCaptured.find(world => {
          const playersAtWorld = playersAtWorldById[world.id];
          return playersAtWorld.length !== 1 || playersAtWorld[0] !== world.capturingPlayerId;
        });

        return nextWorld || null;
      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.nextCapturedWorld$ = this.worlds.byId$.pipe(
      map(worldsbyId => {
        const worldsBeingCaptured = Object.values(worldsbyId).filter(world => world.captureStatus === 'BEING_CAPTURED') as WorldBeingCaptured[]

        const nextWorld = worldsBeingCaptured.sort((a, b) => b.captureTimestamp - a.captureTimestamp)[0] || null;

        return nextWorld ? [nextWorld as (World & WorldBeingCaptured), nextWorld.capturingPlayerId] : [null, '']
      }),
      distinctUntilChanged(equal),
      shareReplay(1)
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