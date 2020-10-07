export type World =
    WorldWithOwner
    | LostWorld;

export type WorldWithOwner =
    ReadyWorld
    | BuildingShipsWorld

export type PopulationByPlayer = {
    [playerId: string]: number
}


export type DominationByPlayerId = {
    [playerId: string]: number;
};


export interface BaseWorldBase {
    id: string;
    metal: number;
    industry: number;
    population: PopulationByPlayer;
    populationLimit: number;
    mines: number;
    integrity: number;
    worldDiscoveredNotificationSent?: boolean;
}

export function totalPopulation(world: World) {
    return Object.values(world.population).reduce((pv, cv) => pv + cv, 0)
}

export function pickPopulationOwner(world: World, random: number) {

    const total = totalPopulation(world);

    let pick = total * random;

    for (const playerId of Object.getOwnPropertyNames(world.population)) {
        pick -= world.population[playerId]
        if (pick < 0) {
            return playerId;
        }
    }
}

export type BaseWorld = BaseWorldBase;

export type WorldWithOwnerBase = BaseWorld & WorldWithMiningStatus & WorldWithPopulationGrowth & WorldWithCaptureStatus & WorldWithCombatStatus

export function baseWorld(world: World): BaseWorld {

    const result: any = {
        id: world.id,
        industry: world.industry,
        metal: world.metal,
        mines: world.mines,
        population: world.population,
        populationLimit: world.populationLimit,
        integrity: world.integrity,
        worldDiscoveredNotificationSent: world.worldDiscoveredNotificationSent
    }

    return result;
}

export function combatCaptureAndMiningStatus(world: WorldWithOwnerBase): WorldWithMiningStatus & WorldWithPopulationGrowth & WorldWithCombatStatus {
    const result = {} as any;

    result.miningStatus = world.miningStatus;
    if (world.miningStatus === 'MINING') {
        result.nextMetalMinedTimestamp = world.nextMetalMinedTimestamp;
    }

    result.populationGrowthStatus = world.populationGrowthStatus
    if (world.populationGrowthStatus === 'GROWING') {
        result.nextPopulationGrowthTimestamp = world.nextPopulationGrowthTimestamp
        result.growingPopulation = world.growingPopulation
    }

    result.combatStatus = world.combatStatus
    if (world.combatStatus === 'FIRING') {
        result.weaponsReadyTimestamp = world.weaponsReadyTimestamp
    }

    return result;
}

export function worldWithOwnerBase(world: WorldWithOwner): WorldWithOwnerBase {
    return {
        ...baseWorld(world),
        ...combatCaptureAndMiningStatus(world)
    } as any
}

export function worldHasOwner(world: World): world is WorldWithOwner {
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
    nextConvertingPlayerId: string,
    nextConvertedPlayerId: string,
    nextConversionTimestamp: number,
    lastDomination: DominationByPlayerId,
    lastPopulation: PopulationByPlayer
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
    nextPopulationGrowthTimestamp: number,
    growingPopulation: number
}

export type LostWorld = BaseWorld & {
    status: 'LOST'
}

export type BuildingShipsWorld = WorldWithOwnerBase & {
    status: 'BUILDING_SHIPS';
    ownerId: string;
    readyTimestamp: number;
    buildingShipsAmount: number;
    buildingShipsActiveIndustry: number;
}

export type ReadyWorld = WorldWithOwnerBase & {
    status: 'READY'
    ownerId: string;
    idleNotificationSent?: boolean;
}