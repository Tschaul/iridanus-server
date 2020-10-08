import { pickFromDistribution, total } from "../../../shared/math/distributions/distribution-helper";
import { PopulationByPlayer } from "../../../shared/model/v1/world";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";

export function calculateNextConversionEvent(
  population: PopulationByPlayer,
  dominatingPlayerId: string,
  baseConversionRate: number,
  random: RandomNumberGenerator
) {

  const generateDelay = () => random.exponential() * baseConversionRate;

  let delay = 0;
  const convertingPlayerId = dominatingPlayerId;
  let convertedPlayerId = '';
  let counter = 0;

  while (counter < 100 && !(convertingPlayerId && convertedPlayerId && convertingPlayerId !== convertedPlayerId)) {

    delay += generateDelay();
    counter++;
    convertedPlayerId = pickFromDistribution(population, random.equal())

  }

  return {
    delay,
    convertedPlayerId,
    convertingPlayerId
  }
}
