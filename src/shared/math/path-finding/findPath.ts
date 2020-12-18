import { Distances } from "../../model/v1/distances";
import { Gates } from "../../model/v1/universe";

export function findPathFromWorldToWorld(fromId: string, toId: string, gates: Gates, dist: Distances): Array<[string, string]> {

  const result: Array<[string, string]> = [];

  let currentId = fromId;

  while (currentId !== toId) {

    let nextId = '';
    let distanceFromNextId = Infinity;

    for (const neighborId of gates[currentId]) {
      if (dist[neighborId][toId] < distanceFromNextId) {
        nextId = neighborId;
        distanceFromNextId = dist[neighborId][toId];
      }
    }

    const allVisitedWorlds = result.reduce((acc, ids) => {
      acc.push(...ids);
      return acc;
    }, [] as string[]);

    if (!nextId || allVisitedWorlds.includes(nextId)) {
      throw new Error("Path could not be found");
    }

    result.push([currentId, nextId]);
    currentId = nextId;
  }

  return result;
}

export function findPathFromGateToWorld(fromIds: [string, string], toId: string, gates: Gates, dist: Distances): Array<[string, string]> {
  const fromId = dist[fromIds[0]][toId] < dist[fromIds[1]][toId]
    ? fromIds[0] : fromIds[1]

  return findPathFromWorldToWorld(fromId, toId, gates, dist);
}

export function findPathFromWorldToOneOfTwoWorlds(fromId: string, toIds: [string, string], gates: Gates, dist: Distances): Array<[string, string]> {
  const toId = dist[fromId][toIds[0]] < dist[fromId][toIds[1]]
    ? toIds[0] : toIds[1]

  return findPathFromWorldToWorld(fromId, toId, gates, dist);
}

export function findPathFromGateToGate(fromIds: [string, string], toIds: [string, string], gates: Gates, dist: Distances): Array<[string, string]> {
  let fromId = '';
  let toId = '';
  let bestDistance = Infinity;

  for (const choiceFrom of fromIds) {
    for(const choiceTo of toIds) {

      const choiceDistance = dist[choiceFrom][choiceTo]

      if (choiceDistance < bestDistance) {
        fromId = choiceFrom;
        toId = choiceTo;
        bestDistance = choiceDistance;
      }

    }
  }

  if (!fromId || !toId) {
    throw new Error("Path could not be found");
  }

  return findPathFromWorldToWorld(fromId, toId, gates, dist);
}