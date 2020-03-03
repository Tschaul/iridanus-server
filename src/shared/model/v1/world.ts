import { WorldOrder } from "./world-order";

export type World =
    WorldWithOwner
    | LostWorld;

export type WorldWithOwner =
    (ReadyWorld
        | BuildingShipWorld
        | BuildingIndustryWorld)

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

export function combatAndMiningStatus(world: WorldWithCombatStatus & WorldWithMiningStatus): WorldWithCombatStatus & WorldWithMiningStatus {
    const result = {} as any;
    result.combatStatus = world.combatStatus;
    if (world.combatStatus === 'FIRING') {
        result.weaponsReadyTimestamp = world.weaponsReadyTimestamp;
    }
    result.miningStatus = world.miningStatus;
    if (world.miningStatus === 'MINING') {
        result.nextMetalMinedTimestamp = world.nextMetalMinedTimestamp;
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

export interface LostWorld extends BaseWorld {
    status: 'LOST'
}

export interface BuildingShipWorldBase extends BaseWorld {
    status: 'BUILDING_SHIP'
    ownerId: string;
    readyTimestamp: number;
}

export type BuildingShipWorld = BuildingShipWorldBase
    & WorldWithCombatStatus
    & WorldWithMiningStatus;

export interface BuildingIndustryWorldBase extends BaseWorld {
    status: 'BUILDING_INDUSTRY'
    ownerId: string;
    readyTimestamp: number;
}

export type BuildingIndustryWorld = BuildingIndustryWorldBase
    & WorldWithCombatStatus
    & WorldWithMiningStatus;

export interface ReadyWorldBase extends BaseWorld {
    status: 'READY'
    ownerId: string;
}

export type ReadyWorld = ReadyWorldBase
    & WorldWithCombatStatus
    & WorldWithMiningStatus;