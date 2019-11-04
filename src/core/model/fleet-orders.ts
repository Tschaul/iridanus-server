export type FleetOrder = 
  WaitOrder 
  | WarpOrder 
  | TransferMetalOrder 
  | TransferShipsOrder;

export interface WaitOrder {
  type: 'WAIT',
  amountTime: number;
}

export interface WarpOrder {
  type: 'WARP',
  targetWorld: string;
}

export interface TransferMetalOrder {
  type: 'TRANSFER_METAL',
  amount: number;
}

export interface TransferShipsOrder {
  type: 'TRANSFER_SHIPS',
  amount: number;
}