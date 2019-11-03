import { Fleet } from "./fleet";
import { World } from "./world";

export interface Universe {

  fleets: {
    [id: string]: Fleet
  },
  worlds: {
    [id: string]: World
  },
  gates: {
    [worldId: string]: string[]
  }
}