export type World =
    WorldWithOwner
    | LostWorld;

export type WorldWithOwner =
    ReadyWorld
    | BuildingShipWorld
    | BuildingIndustryWorld
    | ScrappingShipsWorld

export interface BaseWorldBase {
    id: string;
    metal: number;
    industry: number;
    population: number;
    populationLimit: number;
    mines: number;
    integrity: number;
}

export type BaseWorld = BaseWorldBase & WorldWithCaptureStatus;

export type WorldWithOwnerBase = BaseWorld & WorldWithCombatStatus & WorldWithMiningStatus & WorldWithPopulationGrowth

export function baseWorld(world: World): BaseWorld {
    const result: any = {
        id: world.id,
        industry: world.industry,
        metal: world.metal,
        mines: world.mines,
        population: world.population,
        populationLimit: world.populationLimit,
        integrity: world.integrity,
    }

    result.captureStatus = world.captureStatus
    if (world.captureStatus === 'BEING_CAPTURED') {
        result.capturingPlayerId = world.capturingPlayerId;
        result.captureTimestamp = world.captureTimestamp;
    }

    return result;
}

export function baseWorldWithOwner(world: WorldWithOwnerBase): WorldWithOwnerBase {
    return {
        id: world.id,
        industry: world.industry,
        metal: world.metal,
        mines: world.mines,
        population: world.population,
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

export type WorldWithCaptureStatus =
    WorldNotBeingCaptured
    | WorldBeingCaptured;

export interface WorldNotBeingCaptured {
    captureStatus: 'NOT_BEING_CAPTURED'
}

export interface WorldBeingCaptured {
    captureStatus: 'BEING_CAPTURED',
    capturingPlayerId: string,
    captureTimestamp: number,
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
    buildingShipsAmount: number;
}

export type BuildingIndustryWorld = WorldWithOwnerBase & {
    status: 'BUILDING_INDUSTRY'
    ownerId: string;
    readyTimestamp: number;
}

export type ReadyWorld = WorldWithOwnerBase & {
    status: 'READY'
    ownerId: string;
    idleNotificationSent?: boolean;
}

export type ScrappingShipsWorld = WorldWithOwnerBase & {
    status: 'SCRAPPING_SHIPS'
    readyTimestamp: number;
    ownerId: string;
}