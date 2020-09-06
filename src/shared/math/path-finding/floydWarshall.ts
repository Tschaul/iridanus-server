import { Gates } from "../../model/v1/universe";
import { Distances } from "../../model/v1/distances";

export function floydWarshall(gates: Gates): Distances {

  console.log("FLOYD WARSHALL")

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