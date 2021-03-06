import { totalAmount } from "../../../shared/math/distributions/distribution-helper";
import { WorldWithOwner } from "../../../shared/model/v1/world";

export function calculatePopulationGrowthDelay(world: WorldWithOwner, minimumPopulationGrowthDelay: number) {
  const population = totalGrowingPopulation(world);
  let growthRate = 2 * population * (world.populationLimit - population) / world.populationLimit;
  if (world.worldType.type === 'LUSH') {
    growthRate *= 1.5;
  }
  return minimumPopulationGrowthDelay / growthRate;
}

export function totalGrowingPopulation(world: WorldWithOwner) {
  const growingPopulation = {
    ...world.population
  }

  delete growingPopulation['@natives']
  delete growingPopulation['@defeated']

  return totalAmount(growingPopulation);
}