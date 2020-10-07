import { injectable } from "inversify";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DominationByPlayerId, totalPopulation, World } from "../../shared/model/v1/world";
import { GameSetupProvider } from "../game-setup-provider";
import { FleetProjector } from "./fleet-projector";
import { WorldProjector } from "./world-projector";

type DominationByWorldId = {
  [worldId: string]: DominationByPlayerId;
};

@injectable()
export class ConversionProjector {

  contestedWorldIds$: Observable<string[]>;
  dominationByWorldId$: Observable<{ [worldId: string]: { [playerId: string]: number } }>

  constructor(
    private worlds: WorldProjector,
    private fleets: FleetProjector,
    private setup: GameSetupProvider) {

    this.dominationByWorldId$ = combineLatest([this.worlds.byId$, this.fleets.byCurrentWorldId$]).pipe(
      map(([worldsById, fleetsByWorldId]) => {

        const result: DominationByWorldId = {}

        const addDomination = (domination: DominationByPlayerId, playerId: string, amount: number) => {
          const current = domination[playerId] ?? 0;
          domination[playerId] = current + amount;
        }

        for (const world of Object.values(worldsById)) {
          result[world.id] = {};

          // gather base values

          const fleets = fleetsByWorldId[world.id] ?? [];

          for (const fleet of fleets) {
            addDomination(result[world.id], fleet.ownerId, fleet.ships * this.setup.rules.capture.shipConversionMultiplier)
          }

          for (const playerId of Object.getOwnPropertyNames(world.population)) {
            addDomination(result[world.id], playerId, world.population[playerId] ?? 0)
          }

          // square all values

          let squareSum = 0;

          for (const playerId of Object.getOwnPropertyNames(result[world.id])) {
            const square = result[world.id][playerId] * result[world.id][playerId];
            result[world.id][playerId] = square;
            squareSum += square
          }

          // normalize

          for (const playerId of Object.getOwnPropertyNames(result[world.id])) {
            result[world.id][playerId] = result[world.id][playerId] / squareSum;
          }
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
        if (totalPopulation(world) > 0 && !Object.values(dominationByWorldId[world.id]).includes(1)) {
          result.push(world.id)
        }
      }
      return result;
    }))

  }
}