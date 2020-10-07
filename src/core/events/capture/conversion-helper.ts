import { DominationByPlayerId, PopulationByPlayer, totalPopulation } from "../../../shared/model/v1/world";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";

export function calculateNextConversionEvent(
  population: PopulationByPlayer,
  domination: DominationByPlayerId,
  baseConversionRate: number,
  random: RandomNumberGenerator
) {

  const totalPopulation = total(population);

  const generateDelay = () => random.exponential() * baseConversionRate / totalPopulation;

  let delay = 0;
  let convertingPlayerId = '';
  let convertedPlayerId = '';
  let counter = 0;

  while (counter < 100 && !(convertingPlayerId && convertedPlayerId && convertingPlayerId !== convertedPlayerId)) {

    delay += generateDelay();
    counter++;

    convertedPlayerId = pickFromDistribution(population, random.equal())
    convertingPlayerId = pickFromDistribution(domination, random.equal())

  }

  return {
    delay,
    convertedPlayerId,
    convertingPlayerId
  }
}

type Distribution = {
  [k: string]: number;
};

function pickFromDistribution(dist: Distribution, random: number): string {
  const sum = total(dist);

  let pick = sum * random;

  // if (sum > 1) {
    // console.log({
    //   pick, dist, random
    // })
  // }

  for (const playerId of Object.getOwnPropertyNames(dist)) {
    pick -= dist[playerId]
    if (pick < 0) {
      return playerId;
    }
  }

  throw new Error("Cannot pick from empty distribution");
}

function total(dist: Distribution) {
  return Object.values(dist).reduce((pv, cv) => pv + cv, 0)
}