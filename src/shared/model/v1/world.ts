export type World =
    WorldWithOwner
    | LostWorld;

export type WorldWithOwner =
    ReadyWorld
    | BuildingShipsWorld

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

export type WorldWithOwnerBase = BaseWorld & WorldWithMiningStatus & WorldWithPopulationGrowth & WorldWithCaptureStatus

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

export function combatAndMiningStatus(world: WorldWithOwnerBase): WorldWithMiningStatus & WorldWithPopulationGrowth {
    const result = {} as any;

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

export type BuildingShipsWorld = WorldWithOwnerBase & {
    status: 'BUILDING_SHIPS'
    ownerId: string;
    readyTimestamp: number;
    buildingShipsAmount: number;
    buildingShipsLastState: World;
}

export type ReadyWorld = WorldWithOwnerBase & {
    status: 'READY'
    ownerId: string;
    idleNotificationSent?: boolean;
}