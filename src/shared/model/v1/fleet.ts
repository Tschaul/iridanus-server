import { FleetOrder } from "./fleet-orders";

export type Fleet =
    LostFleet
    | FleetWithOwnerAtWorld
    | WarpingFleet;

export type FleetWithOwnerAtWorld =
    ReadyFleet
    | LeavingFleet
    | ArrivingFleet;

export function fleetIsAtWorld(fleet: Fleet): fleet is FleetWithOwnerAtWorld | LostFleet {
    return fleet.status !== 'WARPING';
}

export function fleetHasOwner(fleet: Fleet): fleet is FleetWithOwnerAtWorld | WarpingFleet {
    return fleet.status !== 'LOST';
}

export function fleetIsAtWorldAndHasOwner(fleet: Fleet): fleet is FleetWithOwnerAtWorld {
    return fleetHasOwner(fleet) && fleetIsAtWorld(fleet);
}

export function baseFleet(fleet: Fleet): BaseFleet {
    return {
        id: fleet.id,
        ships: fleet.ships,
        metal: fleet.metal,
        orders: fleet.orders,
        integrity: fleet.integrity,
        population: fleet.population,
    }
}

export interface BaseFleet {
    id: string;
    ships: number;
    metal: number;
    population: number;
    orders: FleetOrder[];
    integrity: number;
}

export interface LostFleet extends BaseFleet {
    status: 'LOST'
    currentWorldId: string;
}

export interface ReadyFleetBase extends BaseFleet {
    status: 'READY'
    currentWorldId: string;
    ownerId: string;
    // TODO make required
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
