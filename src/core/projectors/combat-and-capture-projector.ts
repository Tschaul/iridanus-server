import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "./world-projector";
import { FleetProjector } from "./fleet-projector";
import { map, distinctUntilChanged, shareReplay } from "rxjs/operators";
import { Fleet, ReadyFleetBase, FiringFleet, FleetAtWorld, fleetIsAtWorld } from "../../shared/model/v1/fleet";
import { World, FiringWorld, WorldWithOwner, worldHasOwner, WorldBeingCaptured } from "../../shared/model/v1/world";
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

    this.playersAtWorldById$ = combineLatest([this.worlds.byId$, this.fleets.byId$]).pipe(
      map(([worldsById, fleetsById]) => {

        const fleets = Object.values(fleetsById);
        const worlds = Object.values(worldsById);

        return this.getPlayersAtWorldById(fleets, worlds);
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

    this.nextStartCapturingWorld$ = combineLatest([this.worlds.byId$, this.playersAtWorldById$, this.fleets.byCurrentWorldId$]).pipe(
      map(([worldsById, playersAtWorldById, fleetsByWorldId]) => {
        const worldsNotBeingCaptured = Object.values(worldsById).filter(world => world.captureStatus === 'NOT_BEING_CAPTURED');

        for (const world of worldsNotBeingCaptured) {
          const capturingPlayer = this.getCapturingPlayer(world, playersAtWorldById, fleetsByWorldId);
          if (capturingPlayer) {
            return [world, capturingPlayer] as [(World & WorldBeingCaptured) | null, string]
          }
        }

        return [null, ''] as [(World & WorldBeingCaptured) | null, string]

      }),
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
      shareReplay(1)
    )

    this.nextCapturedWorld$ = this.worlds.byId$.pipe(
      map(worldsbyId => {
        const worldsBeingCaptured = Object.values(worldsbyId).filter(world => world.captureStatus === 'BEING_CAPTURED') as WorldBeingCaptured[]

        const nextWorld = worldsBeingCaptured.sort((a, b) => a.captureTimestamp - b.captureTimestamp)[0] || null;

        return (nextWorld ? [nextWorld as (World & WorldBeingCaptured), nextWorld.capturingPlayerId] : [null, '']) as [(World & WorldBeingCaptured) | null, string]
      }),
      shareReplay(1)
    )
  }

  private getCapturingPlayer(world: World, playersAtWorldById: { [k: string]: string[] }, fleetsByWorldId: { [k: string]: Fleet[] }) {
    const players = playersAtWorldById[world.id] || [];

    if (!worldHasOwner(world)) {
      return null
    }

    const noOtherOwner = players.filter(id => id !== world.ownerId).length === 1;
    const noFleetsAtWorld = !(fleetsByWorldId[world.id] || []).some(fleet => fleet.ships !== 0 && fleet.ownerId === world.ownerId)
    const worldShouldBeCaptured = noOtherOwner && noFleetsAtWorld;

    if (worldShouldBeCaptured) {
      return playersAtWorldById[world.id].find(id => id !== world.ownerId)
    }

    return null
  }

  private getPlayersAtWorldById(fleets: Fleet[], worlds: World[]): { [k: string]: string[] } {

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