import { totalPopulation, WorldWithOwner } from "../../../shared/model/v1/world";

export function calculatePopulationGrowthDelay(world: WorldWithOwner, minimumPopulationGrowthDelay: number) {
  const population = totalPopulation(world);
  let growthRate = 2 * population * (world.populationLimit - population) / world.populationLimit;
  if (world.worldType.type === 'LUSH') {
    growthRate *= 1.5;
  }
  return minimumPopulationGrowthDelay / growthRate;
}