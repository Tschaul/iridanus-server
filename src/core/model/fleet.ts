import { FleetOrder } from "./fleet-orders";

export type Fleet =
    LostFleet
    | FleetAtWorld
    | WarpingFleet;

export type FleetAtWorld =
    ReadyFleet
    | WaitingFleet
    | LeavingFleet
    | ArrivingFleet
    | TransferingMetalFleet
    | TransferingShipsFleet;


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

export interface TransferingMetalFleet extends BaseFleet {
    status: 'TRANSFERING_METAL'
    currentWorldId: string;
    transferAmount: number;
    readyTimestamp: number;
    ownerId: string;
}

export interface TransferingShipsFleet extends BaseFleet {
    status: 'TRANSFERING_SHIPS'
    currentWorldId: string;
    transferAmount: number;
    readyTimestamp: number;
    ownerId: string;
}
