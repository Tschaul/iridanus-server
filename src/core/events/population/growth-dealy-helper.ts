import { World } from "../../../shared/model/v1/world";

export function calculatePopulationGrowthDelay(world: World, minimumPopulationGrowthDelay: number) {
  const growthRate = 2 * world.population * (world.populationLimit - world.population) / world.populationLimit;
  return minimumPopulationGrowthDelay / growthRate;
}