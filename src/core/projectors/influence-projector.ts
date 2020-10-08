import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, shareReplay } from "rxjs/operators";
import { WorldProjector } from "./world-projector";
import { FleetProjector } from "./fleet-projector";
import { combineLatest, Observable } from "rxjs";
import { worldHasOwner } from "../../shared/model/v1/world";
import { PlayerStates } from "../../shared/model/v1/scoring";

type Stat = { [playerId: string]: number }

const incrementStat = (stat: Stat, id: string, value: number) => {
  stat[id] = stat[id] || 0;
  stat[id] += value;
}

@injectable()
export class InfluenceProjector {
  constructor(
    private worlds: WorldProjector,
    private fleets: FleetProjector,
    private store: ReadonlyStore,
  ) { }

  public byPlayerId$ = this.store.state$.pipe(
    map(state => state.players),
    shareReplay(1),
  ) as Observable<PlayerStates>

  private calculatedInfluenceForPlayers$ = combineLatest([
    this.worlds.byId$,
    this.fleets.byId$
  ]).pipe(
    map(
      ([worldsbyId, fleetsById]) => {

        const population: Stat = {}
        const industry: Stat = {}
        const ships: Stat = {}

        Object.values(worldsbyId).forEach(world => {
          if (worldHasOwner(world)) {
            let effectivePopulation = world.population[world.ownerId] ?? 0;
            if (world.worldType.type === 'INSPIRING') {
              effectivePopulation *= 1.5;
            }
            incrementStat(population, world.ownerId, effectivePopulation)
            incrementStat(industry, world.ownerId, world.industry)
          }
        })

        Object.values(fleetsById).forEach(fleet => {
          incrementStat(ships, fleet.ownerId, fleet.ships)
        })

        const allPlayerIds = new Set([
          ...Object.getOwnPropertyNames(population),
          ...Object.getOwnPropertyNames(industry),
          ...Object.getOwnPropertyNames(ships),
        ])

        const influence: Stat = {};

        allPlayerIds.forEach(playerId => {
          influence[playerId] = Math.max(0, (population[playerId] || 0) - (industry[playerId] || 0) - (ships[playerId] || 0))
        })

        return influence;
      }
    ),
    shareReplay(1)
  )

  public playerNeedsInfluenceUpdate$ = combineLatest([
    this.byPlayerId$,
    this.calculatedInfluenceForPlayers$
  ]).pipe(
    map(([scorings, calculatedInfluences]) => {

      for (const playerId of Object.getOwnPropertyNames(scorings)) {
        const influence = calculatedInfluences[playerId] || 0;
        if (scorings[playerId].influence !== influence) {
          return [playerId, influence]
        }
      }
      return [null, null]
    })
  )
}