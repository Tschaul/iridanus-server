import { injectable } from "inversify";
import { ReadonlyStore } from "../store";
import { map, distinctUntilChanged, shareReplay, startWith } from "rxjs/operators";
import { WorldProjector } from "./world-projector";
import { FleetProjector } from "./fleet-projector";
import { combineLatest, Observable } from "rxjs";
import { worldhasOwner } from "../../shared/model/v1/world";
import { fleetHasOwner } from "../../shared/model/v1/fleet";
import equal from 'deep-equal';
import { Scorings } from "../../shared/model/v1/scoring";

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
    map(state => state.scorings),
    distinctUntilChanged(equal),
    shareReplay(1),
  ) as Observable<Scorings>

  private calculatedInfluenceForPlayers$ = combineLatest([
    this.worlds.byId$,
    this.fleets.byId$
  ]).pipe(
    map(
      ([worldsbyId, fleetsById]) => {

        const population: Stat = {}
        const industry: Stat = {}
        const mines: Stat = {}
        const ships: Stat = {}

        Object.values(worldsbyId).forEach(world => {
          if (worldhasOwner(world)) {
            incrementStat(population, world.ownerId, world.population)
            incrementStat(industry, world.ownerId, world.industry)
            incrementStat(mines, world.ownerId, world.mines)
            incrementStat(ships, world.ownerId, world.ships)
          }
        })

        Object.values(fleetsById).forEach(fleet => {
          if (fleetHasOwner(fleet)) {
            incrementStat(ships, fleet.ownerId, fleet.ships)
          }
        })

        const allPlayerIds = new Set([
          ...Object.getOwnPropertyNames(population),
          ...Object.getOwnPropertyNames(industry),
          ...Object.getOwnPropertyNames(mines),
          ...Object.getOwnPropertyNames(ships),
        ])

        const influence: Stat = {};

        allPlayerIds.forEach(playerId => {
          influence[playerId] = Math.max(0, (population[playerId] || 0) - (industry[playerId] || 0) - (mines[playerId] || 0) - (ships[playerId] || 0))
        })

        return influence;
      }
    ),
    distinctUntilChanged(equal),
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