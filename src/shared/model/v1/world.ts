import { WorldOrder } from "./world-order";

export type World =
    WorldWithOwner
    | LostWorld;

export type WorldWithOwner =
        ReadyWorld
        | BuildingShipWorld
        | BuildingIndustryWorld
        | ScrappingShipsWorld

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

export type WorldWithOwnerBase = BaseWorld & WorldWithCombatStatus & WorldWithMiningStatus & WorldWithPopulationGrowth

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

export function baseWorldWithOwner(world: WorldWithOwnerBase): WorldWithOwnerBase {
    return {
        id: world.id,
        industry: world.industry,
        metal: world.metal,
        mines: world.mines,
        orders: world.orders,
        population: world.population,
        ships: world.ships,
        integrity: world.integrity,
        ...combatAndMiningStatus(world)
    }
}

export function combatAndMiningStatus(world: WorldWithOwnerBase): WorldWithOwnerBase {
    const result = {} as any;
    result.combatStatus = world.combatStatus;
    if (world.combatStatus === 'FIRING') {
        result.weaponsReadyTimestamp = world.weaponsReadyTimestamp;
    }
    result.miningStatus = world.miningStatus;
    if (world.miningStatus === 'MINING') {
        result.nextMetalMinedTimestamp = world.nextMetalMinedTimestamp;
    }
    result.populationGrowthStatus = world.populationGrowthStatus
    if (world.populationGrowthStatus === 'GROWING') {
        result.nextPopulationGrowthTimestamp = world.nextPopulationGrowthTimestamp
    }
    return result;
}

export function worldhasOwner(world: World): world is WorldWithOwner {
    return world.status !== 'LOST';
}

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

export type WorldWithMiningStatus =
    NotMiningWorld
    | MiningWorld;

export interface NotMiningWorld {
    miningStatus: 'NOT_MINING'
}

export interface MiningWorld {
    miningStatus: 'MINING',
    nextMetalMinedTimestamp: number
}

export type WorldWithPopulationGrowth =
    NotGrowingWorld
    | GrowingWorld;

export interface NotGrowingWorld {
    populationGrowthStatus: 'NOT_GROWING'
}

export interface GrowingWorld {
    populationGrowthStatus: 'GROWING',
    nextPopulationGrowthTimestamp: number
}

export type LostWorld = BaseWorld & {
    status: 'LOST'
}

export type BuildingShipWorld = WorldWithOwnerBase & {
    status: 'BUILDING_SHIP'
    ownerId: string;
    readyTimestamp: number;
}

export type BuildingIndustryWorld = WorldWithOwnerBase & {
    status: 'BUILDING_INDUSTRY'
    ownerId: string;
    readyTimestamp: number;
}

export type ReadyWorld = WorldWithOwnerBase & {
    status: 'READY'
    ownerId: string;
}

export type ScrappingShipsWorld = WorldWithOwnerBase & {
    status: 'SCRAPPING_SHIPS'
    readyTimestamp: number;
    ownerId: string;
}