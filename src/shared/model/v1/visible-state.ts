import { Gates } from "./universe";
import { World } from "./world";
import { Fleet } from "./fleet";
import { RemeberedWorld } from "./visibility-status";

export interface VisibleState {
  currentTimestamp: number;
  gameEndTimestamp: number;
  universe: VisibleUniverse;
}

export interface VisibleUniverse {
  fleets: {
    [id: string]: Fleet
  },
  worlds: {
    [id: string]: VisibleWorld
  }
  gates: Gates,
}

export type VisibleWorld =
  World
  | UnknownWorld
  | RemeberedWorld

export interface UnknownWorld {
  id: string
  status: 'UNKNOWN'
}