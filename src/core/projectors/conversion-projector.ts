import { injectable } from "inversify";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Distribution, majorityHolder } from "../../shared/math/distributions/distribution-helper";
import { totalPopulation, worldHasOwner } from "../../shared/model/v1/world";
import { GameSetupProvider } from "../game-setup-provider";
import { FleetProjector } from "./fleet-projector";
import { WorldProjector } from "./world-projector";

type DominatingPlayerByWorldId = {
  [worldId: string]: string | null;
};

@injectable()
export class ConversionProjector {

  contestedWorldIds$: Observable<string[]>;
  dominationByWorldId$: Observable<DominatingPlayerByWorldId>

  constructor(
    private worlds: WorldProjector,
    private fleets: FleetProjector,
    private setup: GameSetupProvider) {

    this.dominationByWorldId$ = combineLatest([this.worlds.byId$, this.fleets.byCurrentWorldId$]).pipe(
      map(([worldsById, fleetsByWorldId]) => {

        const result: DominatingPlayerByWorldId = {}

        const addDomination = (domination: Distribution, playerId: string, amount: number) => {
          const current = domination[playerId] ?? 0;
          domination[playerId] = current + amount;
        }

        for (const world of Object.values(worldsById)) {
          const dist: Distribution = {};

          // gather base values

          const fleets = fleetsByWorldId[world.id] ?? [];

          for (const fleet of fleets) {
            addDomination(dist, fleet.ownerId, fleet.ships * this.setup.rules.capture.shipConversionMultiplier)
          }

          if (worldHasOwner(world)) {
            for (const playerId of Object.getOwnPropertyNames(world.population)) {
              addDomination(dist, playerId, world.population[playerId] ?? 0)
            }
          }

          // square all values

          result[world.id] = majorityHolder(dist);
        }

        return result;
      })
    )

    this.contestedWorldIds$ = combineLatest([
      this.worlds.byId$,
      this.dominationByWorldId$
    ]).pipe(map(([worldsById, dominationByWorldId]) => {
      const result: string[] = []

      for (const world of Object.values(worldsById)) {
        if (worldHasOwner(world) && totalPopulation(world) > 0 && dominationByWorldId[world.id] && dominationByWorldId[world.id] !== world.ownerId) {
          result.push(world.id)
        }
      }
      return result;
    }))

  }
}