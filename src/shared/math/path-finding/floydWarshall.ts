import { Gates } from "../../model/v1/universe";
import { Distances } from "../../model/v1/distances";

export function floydWarshallGates(gates: Gates): Distances {

  const dist: Distances = {}

  const allWorlds = Object.getOwnPropertyNames(gates);

  for (const fromId of allWorlds) {
    dist[fromId] = {}
    for (const toId of allWorlds) {
      if (fromId === toId) {
        dist[fromId][toId] = 0;
      } else if (gates[fromId].includes(toId)) {
        dist[fromId][toId] = 1;
      } else {
        dist[fromId][toId] = Infinity;
      }
    }
  }
  
  for (const overId of allWorlds) {
    for (const fromId of allWorlds) {
      for (const toId of allWorlds) {
        if (dist[fromId][toId] > dist[fromId][overId] + dist[overId][toId]) {
          dist[fromId][toId] = dist[fromId][overId] + dist[overId][toId]
        }
      }
    }
  }

  return dist;

}

export function floydWarshallDistances(distRaw: Distances) {
  const dist: Distances = {}

  const allWorlds = Object.getOwnPropertyNames(distRaw);

  for (const fromId of allWorlds) {
    dist[fromId] = {}
    for (const toId of allWorlds) {
      if (fromId === toId) {
        dist[fromId][toId] = 0;
      }  else {
        dist[fromId][toId] = distRaw[fromId]?.[toId] ?? Infinity;
      }
    }
  }

  floydWarshallInternal(dist)
  return dist;
}

function floydWarshallInternal(dist: Distances) {

  const allWorlds = Object.getOwnPropertyNames(dist);

  for (const overId of allWorlds) {
    for (const fromId of allWorlds) {
      for (const toId of allWorlds) {
        if (dist[fromId][toId] > dist[fromId][overId] + dist[overId][toId]) {
          dist[fromId][toId] = dist[fromId][overId] + dist[overId][toId]
        }
      }
    }
  }
}