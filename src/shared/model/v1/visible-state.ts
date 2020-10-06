import { Gates } from "./universe";
import { World, worldhasOwner, WorldWithOwner } from "./world";
import { Fleet } from "./fleet";
import { PlayerStates } from "./scoring";

export interface VisibleState {
  currentTimestamp: number;
  gameEndTimestamp: number;
  gameStartTimestamp: number;
  universe: VisibleUniverse;
  players: PlayerStates
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

export interface WorldInFogOfWar {
  id: string
  status: 'FOG_OF_WAR',
  ownerId?: string,
  industry: number,
  mines: number,
  population: number,
  populationLimit: number,
}

export type VisibleWorld =
  World
  | UnknownWorld
  | WorldInFogOfWar

export interface UnknownWorld {
  id: string
  status: 'UNKNOWN'
}

export function applyFogOfWar(world: World): WorldInFogOfWar {
  return {
    id: world.id,
    industry: world.industry,
    mines: world.mines,
    population: world.population,
    populationLimit: world.populationLimit,
    status: 'FOG_OF_WAR',
    ownerId: worldhasOwner(world) ? world.ownerId : undefined
  }
}

export function visibleWorldhasOwner(world: VisibleWorld): world is WorldWithOwner | WorldInFogOfWar & {ownerid: string} {
  return world.status !== 'LOST' && world.status !== 'UNKNOWN' && !!world.ownerId;
}

export function visibleWorldIsWorld(world: VisibleWorld): world is World {
  return world.status !== 'UNKNOWN' && world.status !== 'FOG_OF_WAR';
}