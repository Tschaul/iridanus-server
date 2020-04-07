import { Gates } from "./universe";
import { World, WorldWithOwner } from "./world";
import { Fleet } from "./fleet";
import { RemeberedWorld } from "./visibility-status";
import { Scorings } from "./scoring";

export interface VisibleState {
  currentTimestamp: number;
  gameEndTimestamp: number;
  gameStartTimestamp: number;
  universe: VisibleUniverse;
  scorings: Scorings
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


export function visibleWorldhasOwner(world: VisibleWorld): world is WorldWithOwner | RemeberedWorld & {ownerid: string} {
  return world.status !== 'LOST' && world.status !== 'UNKNOWN' && !!world.ownerId;
}

export function visibleWorldIsWorld(world: VisibleWorld): world is World {
  return world.status !== 'UNKNOWN' && world.status !== 'REMEBERED';
}