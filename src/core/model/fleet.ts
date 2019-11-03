import { FleetOrder } from "./fleet-orders";

export type Fleet = LostFleet | ReadyFleet | WaitingFleet | LeavingFleet | WarpingFleet | ArrivingFleet | LoadingMetalFleet | DropingMetalFleet | LoadingShipsFleet | DropingShipsFleet;

export function baseFleet(fleet: Fleet): BaseFleet {
    return {
        id: fleet.id,
        ships: fleet.ships,
        metal: fleet.metal,
        orders: fleet.orders,
    }
}

export interface BaseFleet {
    id: string;
    ships: number;
    metal: number;
    orders: FleetOrder[];
}

export interface LostFleet extends BaseFleet {
    status: 'LOST'
    currentWorldId: string;
}

export interface ReadyFleet extends BaseFleet {
    status: 'READY'
    currentWorldId: string;
    ownerId: string;
}

export interface WaitingFleet extends BaseFleet {
    status: 'WAITING'
    currentWorldId: string;
    readyTimestamp: number;
    ownerId: string;
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

export interface LoadingMetalFleet extends BaseFleet {
    status: 'LOADING_METAL'
    currentWorldId: string;
    metalAmount: number;
    readyTimestamp: number;
    ownerId: string;
}

export interface DropingMetalFleet extends BaseFleet {
    status: 'DROPING_METAL'
    currentWorldId: string;
    metalAmount: number;
    readyTimestamp: number;
    ownerId: string;
}

export interface LoadingShipsFleet extends BaseFleet {
    status: 'LOADING_SHIPS'
    currentWorldId: string;
    shipAmount: number;
    readyTimestamp: number;
    ownerId: string;
}

export interface DropingShipsFleet extends BaseFleet {
    status: 'DROPING_SHIPS'
    currentWorldId: string;
    shipAmount: number;
    readyTimestamp: number;
    ownerId: string;
}