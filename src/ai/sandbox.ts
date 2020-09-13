// @ts-ignore
import * as solver from "javascript-lp-solver";
import { IModel } from "./solver";
import { aiTestMap } from "./sandbox-data";
import { floydWarshall } from "../shared/math/path-finding/floydWarshall";
import { Fleet, fleetIsAtWorld } from "../shared/model/v1/fleet";
import { makeConfig } from "../core/setup/simple-config";
import { generatePotential } from "../shared/math/path-finding/potential";
import { makeGomeisaThreeRandom } from "../util/hex-map/gomeisa-three-random";
import { worldhasOwner } from "../shared/model/v1/world";

const modela: IModel = {
  optimize: "production",
  opType: "max",
  constraints: {
    used_free_space_w1: { max: 0 },
    used_occupied_space_w1: { max: 25 },
    active_industry_w1: { max: 50 },
    active_industry_w2: { max: 0 },
    active_industry_w3: { max: 0 },
    metal_w1: { min: 0 },
    metal_w2: { min: 0 },
    metal_w3: { min: -20 },
    ships: { max: 30 }
  },
  variables: {
    run_industry_w1: {
      active_industry_w1: 1,
      metal_w1: -0.2,
      production: 0.2
    },
    run_industry_w2: {
      active_industry_w2: 1,
      metal_w2: -0.2,
      production: 0.2
    },
    run_industry_w3: {
      active_industry_w3: 1,
      metal_w3: -0.2,
      production: 0.2
    },
    deploy_w1: {
      active_industry_w1: -1,
      ships: 1
    },
    deploy_w2: {
      active_industry_w2: -1,
      ships: 1
    },
    deploy_w3: {
      active_industry_w3: -1,
      ships: 1
    },
    cargo_w1_w2: {
      metal_w1: 1,
      metal_w2: -1,
      ships: 1
    },
    cargo_w2_w3: {
      metal_w2: 1,
      metal_w3: -1,
      ships: 1
    },
  },
  ints: {
    run_industry_w1: 1,
    deploy_w1: 1,
    cargo_w1_w2: 1,
    cargo_w2_w3: 1,
  }
}

const model: IModel = {
  optimize: 'production',
  opType: 'max',
  constraints: {},
  variables: {},
  ints: {}
}

// const gameMap = makeGomeisaThreeRandom();
const gameMap = aiTestMap;
const playerId = 'p1'

const config = makeConfig(1000)
const worlds = Object.values(gameMap.universe.worlds);
const fleets = Object.values(gameMap.universe.fleets);
const distances = floydWarshall(gameMap.universe.gates);
const now = 0

const timeFrame = config.warping.warpToWorldDelay * 12;

let totalIndustry = 0;
let totalShips = 0;

for (const world of worlds) {

  if (!worldhasOwner(world) || world.ownerId === playerId) {

    totalIndustry += world.industry;

    // active industry constraint
    model.constraints['active_industry_' + world.id] = { max: world.industry * timeFrame }

    // delta metal constraint
    model.constraints['delta_metal_' + world.id] = { min: -1 * world.metal }

    // free and occupied living space
    model.constraints['free_living_space_' + world.id] = { max: (world.populationLimit - world.population) * timeFrame }
    model.constraints['occupied_living_space_' + world.id] = { max: world.population * timeFrame }

    // run industry option
    model.variables['run_industry_' + world.id] = {
      ['active_industry_' + world.id]: config.building.buildShipDelay,
      ['delta_metal_' + world.id]: -1,
      production: 1,
    }

    // make babies option
    model.variables['reproduce_population_' + world.id] = {
      ['free_living_space_' + world.id]: config.population.minimumPopulationGrowthDelay,
      ['occupied_living_space_' + world.id]: config.population.minimumPopulationGrowthDelay,
      production: 1,
    }

    for (const neighboringWorldId of gameMap.universe.gates[world.id]) {

      model.constraints['migration_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId] = { max: 0 }

      model.variables['migrate_population_from_world_' + world.id + '_to_world_' + neighboringWorldId] = {
        ['free_living_space_' + world.id]: 1 * timeFrame,
        ['occupied_living_space_' + world.id]: -1 * timeFrame,
        ['free_living_space_' + neighboringWorldId]: -1 * timeFrame,
        ['occupied_living_space_' + neighboringWorldId]: 1 * timeFrame,
        ['migration_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId]: 4 * config.warping.warpToWorldDelay
      };

      model.constraints['transport_metal_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId] = { max: 0 }

      model.variables['transport_metal_from_world_' + world.id + '_to_world_' + neighboringWorldId] = {
        ['delta_metal_' + neighboringWorldId]: 1,
        ['delta_metal_' + world.id]: -1,
        ['transport_metal_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId]: 2 * config.warping.warpToWorldDelay
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

      const warpTime = delay + distanceToWorld * config.warping.warpToWorldDelay;

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

        const warpTime = delay + minDistance * config.warping.warpToWorldDelay;

        if (warpTime < timeFrame) {

          const cargoTime = timeFrame - warpTime;

          model.variables['order_cargo_with_' + fleet.id + '_from_world_' + world.id + '_to_world_' + neighboringWorldId] = {
            ['used_fleet_' + fleet.id]: 1,
            ['migration_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId]: -1 * cargoTime,
            ['migration_opportunity_from_world_' + neighboringWorldId + '_to_world_' + world.id]: -1 * cargoTime,
            ['transport_metal_opportunity_from_world_' + world.id + '_to_world_' + neighboringWorldId]: -1 * cargoTime,
            ['transport_metal_opportunity_from_world_' + neighboringWorldId + '_to_world_' + world.id]: -1 * cargoTime,
          };
          // model.ints!['cargo_with_' + fleet.id + '_from_world_' + world.id + '_to_world_' + neighboringWorldId] = true

        }
      }


    }
  }
}

const fleetsToDeploy = Math.max(0, totalShips - (totalShips + totalIndustry) / 2);

model.constraints.deployed_fleet = { max: fleetsToDeploy}

console.log(model);

const result = solver.Solve(model);
console.log(result);


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