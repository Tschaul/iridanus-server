import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, shareReplay } from "rxjs/operators";
import { WorldProjector } from "./world-projector";
import { FleetProjector } from "./fleet-projector";
import { combineLatest, Observable } from "rxjs";
import { World, worldHasOwner } from "../../shared/model/v1/world";
import { PlayerStates } from "../../shared/model/v1/player-state";
import { PlayerProjector } from "./player-projector";
import { Fleet } from "../../shared/model/v1/fleet";

type Stat = { [playerId: string]: number }

const incrementStat = (stat: Stat, id: string, value: number) => {
  stat[id] = stat[id] || 0;
  stat[id] += value;
}

@injectable()
export class StatsProjector {
  constructor(
    private worlds: WorldProjector,
    private fleets: FleetProjector,
    private players: PlayerProjector
  ) { }

  public statsByPlayer$ = combineLatest([
    this.worlds.byId$,
    this.fleets.byId$,
    this.players.allPlayerIds$
  ]).pipe(
    map(
      ([worldsbyId, fleetsById, allPlayerIds]) => {

        return this.extractStats(allPlayerIds, worldsbyId, fleetsById);
      }
    ),
    shareReplay(1)
  )

  public extractStats(allPlayerIds: string[], worldsbyId: { [id: string]: World; }, fleetsById: { [k: string]: Fleet; }) {
    const population: Stat = {};
    const industry: Stat = {};
    const ships: Stat = {};
    const metal: Stat = {};

    allPlayerIds.forEach(id => {
      population[id] = 0;
      industry[id] = 0;
      ships[id] = 0;
      metal[id] = 0;
    });

    Object.values(worldsbyId).forEach(world => {
      if (worldHasOwner(world)) {
        let effectivePopulation = world.population[world.ownerId] ?? 0;
        if (world.worldType.type === 'INSPIRING') {
          effectivePopulation *= 1.5;
        }
        incrementStat(population, world.ownerId, effectivePopulation);
        incrementStat(industry, world.ownerId, world.industry);
        incrementStat(metal, world.ownerId, world.metal);
      }
    });

    Object.values(fleetsById).forEach(fleet => {
      incrementStat(ships, fleet.ownerId, fleet.ships);
      if (fleet.status === 'TRANSFERING_CARGO') {
        incrementStat(population, fleet.ownerId, fleet.cargoPopulation);
        incrementStat(metal, fleet.ownerId, fleet.cargoMetal);
      }
    });

    return {
      population,
      industry,
      ships,
      metal
    };
  }
}