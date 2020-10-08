import { total } from "../../math/distributions/distribution-helper";
import { WorldType } from "./world-type";

export type World =
    WorldWithOwner
    | LostWorld;

export type WorldWithOwner = BaseWorld & {
    status: 'OWNED';
    ownerId: string;
    population: PopulationByPlayer;
    miningStatus: WorldWithMiningStatus;
    combatStatus: WorldCombatStatus;
    populationGrowthStatus: PopulationGrowthStatus;
    populationConversionStatus: PopulationConverstionStatus;
    buildShipsStatus: BuildingShipsStatus;
}

export type PopulationByPlayer = {
    [playerId: string]: number
}


export type DominationByPlayerId = {
    [playerId: string]: number;
};


export interface BaseWorld {
    worldType: WorldType;
    id: string;
    metal: number;
    industry: number;
    populationLimit: number;
    mines: number;
    worldHasBeenDiscovered: boolean;
}

export function totalPopulation(world: WorldWithOwner) {
    return total(world.population)
}

export type WorldWithOwnerBase = BaseWorld & WorldWithMiningStatus & PopulationGrowthStatus & PopulationConverstionStatus & WorldCombatStatus

export function baseWorld(world: World): BaseWorld {

    const result: BaseWorld = {
        worldType: world.worldType,
        id: world.id,
        industry: world.industry,
        metal: world.metal,
        mines: world.mines,
        populationLimit: world.populationLimit,
        worldHasBeenDiscovered: !!world.worldHasBeenDiscovered
    }

    return result;
}

export function worldHasOwner(world: World): world is WorldWithOwner {
    return world.status === 'OWNED';
}

export type WorldCombatStatus =
    WorldAtPeace
    | FiringWorld;

export interface WorldAtPeace {
    type: 'AT_PEACE'
}

export interface FiringWorld {
    type: 'FIRING',
    weaponsReadyTimestamp: number
}

export type PopulationConverstionStatus =
    WorldNotBeingCaptured
    | WorldBeingCaptured;

export interface WorldNotBeingCaptured {
    type: 'NOT_BEING_CAPTURED'
}

export interface WorldBeingCaptured {
    type: 'BEING_CAPTURED',
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
    type: 'NOT_MINING'
}

export interface MiningWorld {
    type: 'MINING',
    nextMetalMinedTimestamp: number
}

export type PopulationGrowthStatus =
    NotGrowingWorld
    | GrowingWorld;

export interface NotGrowingWorld {
    type: 'NOT_GROWING'
}

export interface GrowingWorld {
    type: 'GROWING',
    nextPopulationGrowthTimestamp: number,
    growingPopulation: number
}

export type LostWorld = BaseWorld & {
    status: 'LOST'
}

export type BuildingShipsStatus =
    BuildingShipsWorld
    | ReadyWorld;

export type BuildingShipsWorld = {
    type: 'BUILDING_SHIPS';
    ownerId: string;
    readyTimestamp: number;
    amount: number;
    activeIndustry: number;
}

export type ReadyWorld = {
    type: 'NOT_BUILDING_SHIPS'
}