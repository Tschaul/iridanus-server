import { Distances } from "../../model/v1/distances";

export function generatePotential(attractivity: {[worldId: string]: number}, distances: Distances): {[worldId: string]: number} {
  const result: {[worldId: string]: number} = {};
  
  for (const worldId of Object.getOwnPropertyNames(distances)) {

    let potential = 0;

    for (const otherWorldId of Object.getOwnPropertyNames(distances)) {

      const distance =  distances[worldId][otherWorldId];

      if (isFinite(distance)) {
        potential += (attractivity[otherWorldId] ?? 0)/(distance + 1)
      }
    }

    result[worldId] = potential;
  }

  return result;
}