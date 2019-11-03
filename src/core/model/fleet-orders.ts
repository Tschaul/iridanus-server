export type FleetOrder = WaitOrder | WarpOrder | LoadMetalOrder | DropMetalOrder | LoadShipsOrder | DropShipsOrder;

export interface WaitOrder {
  type: 'WAIT',
  amountTime: number;
}

export interface WarpOrder {
  type: 'WARP',
  targetWorld: string;
}

export interface LoadMetalOrder {
  type: 'LOAD_METAL',
  amount: number;
}

export interface DropMetalOrder {
  type: 'DROP_METAL',
  amount: number;
}

export interface LoadShipsOrder {
  type: 'LOAD_SHIPS',
  amount: number;
}

export interface DropShipsOrder {
  type: 'DROP_SHIPS',
  amount: number;
}