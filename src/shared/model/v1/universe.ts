import { Fleet } from "./fleet";
import { World } from "./world";

export interface Gates {
  [worldId: string]: string[]
}

export interface Universe {

  fleets: {
    [id: string]: Fleet
  },
  worlds: {
    [id: string]: World
  },
  gates: Gates,
}