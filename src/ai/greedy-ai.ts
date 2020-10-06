// @ts-ignore
import * as solver from "javascript-lp-solver";
import { Observable } from "rxjs";
import { distinctUntilChanged, filter, map } from "rxjs/operators";
import { GameSetupProvider } from "../core/game-setup-provider";
import { Store } from "../core/store";
import { floydWarshall } from "../shared/math/path-finding/floydWarshall";
import { Fleet, fleetIsAtWorld } from "../shared/model/v1/fleet";
import { GameState } from "../shared/model/v1/state";
import { worldHasOwner } from "../shared/model/v1/world";
import { Ai, FleetOrders } from "./model";
import { IModel, Solution } from "./solver";

export class GreedyAi implements Ai {

  constructor(private store: Store, private config: GameSetupProvider) { }

  play(playerId: string) {

    this.store.state$.pipe(
      distinctUntilChanged(
        (a, b) => a != b,
        (it: GameState) => (it.currentTimestamp - it.gameStartTimestamp) % this.config.rules.warping.warpToWorldDelay
      ),
    )

  }


  private askSolver(gameMap: GameState, playerId: string): FleetOrders {

    const model: IModel = {
      optimize: 'production',
      opType: 'max',
      constraints: {},
      variables: {},
      ints: {}
    }

    const rules = this.config.rules;
    const worlds = Object.values(gameMap.universe.worlds);
    const fleets = Object.values(gameMap.universe.fleets);
    const distances = floydWarshall(gameMap.universe.gates);
    const now = 0

    const timeFrame = rules.warping.warpToWorldDelay * 12;

    let totalIndustry = 0;
    let totalShips = 0;

    for (const world of worlds) {

      if (!worldHasOwner(world) || world.ownerId === playerId) {

        const population = worldHasOwner(world) ? world.population[world.ownerId] : 0;

        totalIndustry += world.industry;

        // active industry constraint
        model.constraints['active_industry_' + world.id] = { max: world.industry * timeFrame }

        // delta metal constraint
        model.constraints['delta_metal_' + world.id] = { min: -1 * world.metal }

        // free and occupied living space
        model.constraints['free_living_space_' + world.id] = { max: (world.populationLimit - population) * timeFrame }
        model.constraints['occupied_living_space_' + world.id] = { max: population * timeFrame }

        // run industry option
        model.variables['run_industry_' + world.id] = {
          ['active_industry_' + world.id]: rules.building.buildShipDelay,
          ['delta_metal_' + world.id]: -1,
          production: 1,
        }

        // make babies option
        model.variables['reproduce_population_' + world.id] = {
          ['free_living_space_' + world.id]: rules.population.minimumPopulationGrowthDelay,
          ['occupied_living_space_' + world.id]: rules.population.minimumPopulationGrowthDelay,
          production: 1,
        }

        for (const neighboringWorldId of gameMap.universe.gates[world.id]) {

          model.constraints['migration_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId] = { max: 0 }

          model.variables['migrate_population_from_world_' + world.id + '_to_world_' + neighboringWorldId] = {
            ['free_living_space_' + world.id]: 1 * timeFrame,
            ['occupied_living_space_' + world.id]: -1 * timeFrame,
            ['free_living_space_' + neighboringWorldId]: -1 * timeFrame,
            ['occupied_living_space_' + neighboringWorldId]: 1 * timeFrame,
            ['migration_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId]: 4 * rules.warping.warpToWorldDelay
          };

          model.constraints['transport_metal_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId] = { max: 0 }

          model.variables['transport_metal_from_world_' + world.id + '_to_world_' + neighboringWorldId] = {
            ['delta_metal_' + neighboringWorldId]: 1,
            ['delta_metal_' + world.id]: -1,
            ['transport_metal_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId]: 2 * rules.warping.warpToWorldDelay
          };
        }
      }
    }

    for (const fleet of fleets) {
      if (fleet.ownerId === playerId) {

        totalShips += fleet.ships;

        // use every fleet only once constraint
        model.constraints['used_fleet_' + fleet.id] = { max: 1 }

        const [currentWorldId, delay] = nextWorldId(fleet, now)

        for (const world of worlds) {

          const distanceToWorld = distances[currentWorldId][world.id];

          const warpTime = delay + distanceToWorld * rules.warping.warpToWorldDelay;

          if (warpTime < timeFrame) {
            model.variables['order_deploy_' + fleet.id + '_to_world_' + world.id] = {
              ['used_fleet_' + fleet.id]: 1,
              ['active_industry_' + world.id]: -1 * fleet.ships * (timeFrame - warpTime),
              deployed_fleet: 1
            }
            model.ints!['deploy_' + fleet.id + '_to_world_' + world.id] = true

          }
          for (const neighboringWorldId of gameMap.universe.gates[world.id]) {

            const distanceToNeighboringWorld = distances[currentWorldId][neighboringWorldId];

            const minDistance = Math.min(distanceToWorld, distanceToNeighboringWorld);

            const warpTime = delay + minDistance * rules.warping.warpToWorldDelay;

            if (warpTime < timeFrame) {

              const cargoTime = timeFrame - warpTime;

              model.variables['order_cargo_with_' + fleet.id + '_from_world_' + world.id + '_to_world_' + neighboringWorldId] = {
                ['used_fleet_' + fleet.id]: 1,
                ['migration_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId]: -1 * cargoTime,
                ['migration_opportunity_from_world_' + neighboringWorldId + '_to_world_' + world.id]: -1 * cargoTime,
                ['transport_metal_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId]: -1 * cargoTime,
                ['transport_metal_opportunity_from_world_' + neighboringWorldId + '_to_world_' + world.id]: -1 * cargoTime,
              };
              model.ints!['order_cargo_with_' + fleet.id + '_from_world_' + world.id + '_to_world_' + neighboringWorldId] = true

            }
          }


        }
      }
    }

    const fleetsToDeploy = Math.max(0, totalShips - (totalShips + totalIndustry) / 2);

    model.constraints.deployed_fleet = { max: fleetsToDeploy }

    // console.log(model);

    const result = solver.Solve(model) as Solution<string>;

    const orders: FleetOrders = {}

    // extract orders

    // e.g. ^order_cargo_with_(?<fleetId>[a-zA-Z0-9]+)_from_world_(?<fromWorld>[a-zA-Z0-9]+)_to_world_(?<toWorld>[a-zA-Z0-9]+)$

    return orders;
  }

}

function nextWorldId(fleet: Fleet, now: number): [string, number] {
  if (fleetIsAtWorld(fleet)) {
    return [fleet.currentWorldId, 0]
  } else {
    if (fleet.status === 'WARPING') {
      return [fleet.targetWorldId, fleet.arrivingTimestamp - now]
    } else if (fleet.status === 'TRANSFERING_CARGO') {
      return [fleet.toWorldId, fleet.arrivingTimestamp - now]
    } else {
      return [fleet.fromWorldId, 0]
    }
  }
}