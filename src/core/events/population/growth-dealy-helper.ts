import { totalPopulation, World } from "../../../shared/model/v1/world";

export function calculatePopulationGrowthDelay(world: World, minimumPopulationGrowthDelay: number) {
  const population = totalPopulation(world);
  const growthRate = 2 * population * (world.populationLimit - population) / world.populationLimit;
  return minimumPopulationGrowthDelay / growthRate;
}