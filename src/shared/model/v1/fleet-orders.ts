export type FleetOrder =
  WaitOrder
  | WarpOrder
  | TransferMetalOrder
  | TransferShipsOrder;

export interface WaitOrder {
  type: 'WAIT',
  /**
   * @minimum 0
   */
  amountTime: number;
}

export interface WarpOrder {
  type: 'WARP',
  targetWorldId: string;
}

export interface TransferMetalOrder {
  type: 'TRANSFER_METAL',
  /**
   * @minimum -99
   * @maximum 99
   * @type integer
   */
  amount: number;
}

export interface TransferShipsOrder {
  type: 'TRANSFER_SHIPS',
  /**
   * @minimum -99
   * @maximum 99
   * @type integer
   */
  amount: number;
}