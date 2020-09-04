import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "./world-projector";
import { FleetProjector } from "./fleet-projector";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { Fleet, ReadyFleetBase, FiringFleet, FleetAtWorld, fleetIsAtWorld } from "../../shared/model/v1/fleet";
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

    this.nextLostFleet$ = combineLatest(this.fleets.byId$, this.fleets.byCurrentWorldId$, this.worlds.byId$).pipe(
      map(([fleetsById, fleetsByWorldId, worldsById]) => {

        const ownedFleetsWithoutShips = Object.values(fleetsById).filter(fleet => fleet.ships === 0 && fleetIsAtWorld(fleet)) as FleetAtWorld[];
        const lostOwnedFleet = ownedFleetsWithoutShips.find(fleet => {
          const noOtherFleetsAtWorld = !(fleetsByWorldId[fleet.currentWorldId] || []).some(otherFleet => otherFleet.ships !== 0 && fleetIsAtWorld(otherFleet) && otherFleet.ownerId === fleet.ownerId)
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

        for (const world of worldsNotBeingCaptured) {
          const capturingPlayer = this.getCapturingPlayer(world, playersAtWorldById, fleetsByWorldId);
          if (capturingPlayer) {
            return [world, capturingPlayer]
          }
        }

        return [null, '']

      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.nextStopCapturingWorld$ = combineLatest([
      this.worlds.byId$,
      this.playersAtWorldById$,
      this.fleets.byCurrentWorldId$
    ]).pipe(
      map(([worldsbyId, playersAtWorldById, fleetsByWorldId]) => {
        const worldsBeingCaptured = Object.values(worldsbyId).filter(world => world.captureStatus === 'BEING_CAPTURED') as (World & WorldBeingCaptured)[]

        for (const world of worldsBeingCaptured) {
          const capturingPlayer = this.getCapturingPlayer(world, playersAtWorldById, fleetsByWorldId);
          if (capturingPlayer !== world.capturingPlayerId) {
            return world
          }
        }
        
        return null;
      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )

    this.nextCapturedWorld$ = this.worlds.byId$.pipe(
      map(worldsbyId => {
        const worldsBeingCaptured = Object.values(worldsbyId).filter(world => world.captureStatus === 'BEING_CAPTURED') as WorldBeingCaptured[]

        const nextWorld = worldsBeingCaptured.sort((a, b) => a.captureTimestamp - b.captureTimestamp)[0] || null;

        return nextWorld ? [nextWorld as (World & WorldBeingCaptured), nextWorld.capturingPlayerId] : [null, '']
      }),
      distinctUntilChanged(equal),
      shareReplay(1)
    )
  }

  private getCapturingPlayer(world: World, playersAtWorldById: { [k: string]: string[] }, fleetsByWorldId: { [k: string]: Fleet[] }) {
    const players = playersAtWorldById[world.id] || [];

    if (!worldhasOwner(world)) {
      if (players.length === 1) {
        return players[0]
      }
      return null
    }

    const noOtherOwner = players.filter(id => id !== world.ownerId).length === 1;
    const noFleetsAtWorld = !(fleetsByWorldId[world.id] || []).some(fleet => fleet.ships !== 0 && fleet.ownerId === world.ownerId)
    const worldShouldBeCaptured = world.ships === 0 && noOtherOwner && noFleetsAtWorld;

    if (worldShouldBeCaptured) {
      return playersAtWorldById[world.id].find(id => id !== world.ownerId)
    }

    return null
  }

  private getPlayersAtWorldById(fleets: Fleet[], worlds: World[]): { [k: string]: string[] } {

    const fleetOwnersByWorldId: { [k: string]: string[] } = {};

    for (const fleet of fleets) {
      if (fleetIsAtWorld(fleet)) {
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