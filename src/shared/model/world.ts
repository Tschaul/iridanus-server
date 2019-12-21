import { WorldOrder } from "./world-order";

export type World =
    WorldWithOwner
    | LostWorld;

export type WorldWithOwner = 
    ReadyWorld
    | BuildingShipWorld
    | BuildingIndustryWorld

export interface BaseWorld {
    id: string;
    metal: number;
    ships: number;
    industry: number;
    population: number;
    mines: number;
    orders: WorldOrder[];
    integrity: number;
}

export function baseWorld(world: World): BaseWorld {
    return {
        id: world.id,
        industry: world.industry,
        metal: world.metal,
        mines: world.mines,
        orders: world.orders,
        population: world.population,
        ships: world.ships,
        integrity: world.integrity,
    }
}

export function worldhasOwner(world: World): world is WorldWithOwner {
    return world.status !== 'LOST';
}

export interface ReadyWorldBase extends BaseWorld {
    status: 'READY'
    ownerId: string;
}

export type ReadyWorld = ReadyWorldBase & WorldWithCombatStatus;

export type WorldWithCombatStatus =
    WorldAtPeace
    | FiringWorld;

export interface WorldAtPeace {
    combatStatus: 'AT_PEACE'
}

export interface FiringWorld {
    combatStatus: 'FIRING',
    weaponsReadyTimestamp: number
}

export interface LostWorld extends BaseWorld {
    status: 'LOST'
}

export interface BuildingShipWorld extends BaseWorld {
    status: 'BUILDING_SHIP'
    ownerId: string;
    readyTimestamp: number;
}

export interface BuildingIndustryWorld extends BaseWorld {
    status: 'BUILDING_INDUSTRY'
    ownerId: string;
    readyTimestamp: number;
}