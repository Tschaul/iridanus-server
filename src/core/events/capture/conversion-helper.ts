import { pickFromDistribution, totalAmount } from "../../../shared/math/distributions/distribution-helper";
import { PopulationByPlayer, worldHasOwner } from "../../../shared/model/v1/world";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";

export function calculateNextConversionEvent(
  population: PopulationByPlayer,
  dominatingPlayerId: string | null,
  baseConversionRate: number,
  random: RandomNumberGenerator
) {

  const delay = random.exponential() * baseConversionRate;
  const convertingPlayerId = dominatingPlayerId ?? pickFromDistribution(population, random.equal())

  const populationWithoutConvertingPlayer = {
    ...population,
    [convertingPlayerId]: 0
  }

  if (totalAmount(populationWithoutConvertingPlayer) === 0) {
    return {
      delay,
      convertedPlayerId: convertingPlayerId,
      convertingPlayerId
    }
  }

  const convertedPlayerId = pickFromDistribution(populationWithoutConvertingPlayer, random.equal())

  return {
    delay,
    convertedPlayerId,
    convertingPlayerId
  }
}
