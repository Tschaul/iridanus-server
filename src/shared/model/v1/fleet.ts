import { FleetOrder } from "./fleet-orders";

export type Fleet =
    FleetWithOwnerAtWorld
    | FleetInTransit;

export type FleetWithOwnerAtWorld =
    ReadyFleet
    | LeavingFleet
    | ArrivingFleet;

export type FleetInTransit = 
    WarpingFleet 
    | WaitingForCargoFleet 
    | TransferingCargoFleet;

export function pathOfFleetInTransit(fleet: FleetInTransit): [string, string] {
    if (fleet.status === 'WARPING') {
        return [fleet.originWorldId, fleet.targetWorldId] as [string, string]
    } else {
        return [fleet.fromWorldId, fleet.toWorldId] as [string, string]
    }
}

export function fleetIsAtWorld(fleet: Fleet): fleet is FleetWithOwnerAtWorld {
    return !['TRANSFERING_CARGO', 'WAITING_FOR_CARGO', 'WARPING'].includes(fleet.status);
}

export function baseFleet(fleet: Fleet): BaseFleet {
    return {
        id: fleet.id,
        ships: fleet.ships,
        orders: fleet.orders,
        integrity: fleet.integrity,
    }
}

export interface BaseFleet {
    id: string;
    ships: number;
    orders: FleetOrder[];
    integrity: number;
}

export interface ReadyFleetBase extends BaseFleet {
    status: 'READY'
    currentWorldId: string;
    ownerId: string;
    idleNotificationSent?: boolean;
}

export type ReadyFleet = ReadyFleetBase & FleetWithCombatStatus;

export type FleetWithCombatStatus =
    FleetAtPeace
    | FiringFleet;

export interface FleetAtPeace {
    combatStatus: 'AT_PEACE'
}

export interface FiringFleet {
    combatStatus: 'FIRING',
    weaponsReadyTimestamp: number
}

export interface LeavingFleet extends BaseFleet {
    status: 'LEAVING'
    currentWorldId: string;
    targetWorldId: string;
    warpingTimestamp: number;
    ownerId: string;
}

export interface WarpingFleet extends BaseFleet {
    status: 'WARPING'
    originWorldId: string;
    targetWorldId: string;
    arrivingTimestamp: number;
    ownerId: string;
}

export interface ArrivingFleet extends BaseFleet {
    status: 'ARRIVING'
    currentWorldId: string;
    readyTimestamp: number;
    ownerId: string;
}

export interface TransferingCargoFleet extends BaseFleet {
    status: 'TRANSFERING_CARGO';
    cargoMetal: number;
    cargoPopulation: number;
    ownerId: string;
    fromWorldId: string,
    toWorldId: string,
    arrivingTimestamp: number
}

export interface WaitingForCargoFleet extends BaseFleet {
    status: 'WAITING_FOR_CARGO';
    ownerId: string;
    fromWorldId: string,
    toWorldId: string,
}
