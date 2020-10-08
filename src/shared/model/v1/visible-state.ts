import { Gates } from "./universe";
import { PopulationByPlayer, World, worldHasOwner, WorldWithOwner } from "./world";
import { Fleet } from "./fleet";
import { PlayerStates } from "./scoring";
import { WorldType } from "./world-type";

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
  worldType: WorldType;
  id: string
  status: 'FOG_OF_WAR',
  ownerId?: string,
  industry: number,
  mines: number,
  population: PopulationByPlayer,
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
    worldType: world.worldType,
    id: world.id,
    industry: world.industry,
    mines: world.mines,
    population: worldHasOwner(world) ? world.population : {},
    populationLimit: world.populationLimit,
    status: 'FOG_OF_WAR',
    ownerId: worldHasOwner(world) ? world.ownerId : undefined
  }
}

export function visibleWorldhasOwner(world: VisibleWorld): world is WorldWithOwner | WorldInFogOfWar & {ownerid: string} {
  return world.status !== 'LOST' && world.status !== 'UNKNOWN' && !!world.ownerId;
}

export function visibleWorldIsWorld(world: VisibleWorld): world is World {
  return world.status !== 'UNKNOWN' && world.status !== 'FOG_OF_WAR';
}