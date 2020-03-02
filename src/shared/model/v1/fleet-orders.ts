export type FleetOrder =
  WaitOrder
  | WarpOrder
  | LoadMetalOrder
  | DropMetalOrder
  | LoadShipsOrder
  | DropShipsOrder;

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

export interface LoadMetalOrder {
  type: 'LOAD_METAL',
  /**
   * @minimum 1
   * @maximum 99
   * @type integer
   */
  amount: number;
}

export interface DropMetalOrder {
  type: 'DROP_METAL',
  /**
   * @minimum 1
   * @maximum 99
   * @type integer
   */
  amount: number;
}

export interface LoadShipsOrder {
  type: 'LOAD_SHIPS',
  /**
   * @minimum 1
   * @maximum 99
   * @type integer
   */
  amount: number;
}

export interface DropShipsOrder {
  type: 'DROP_SHIPS',
  /**
   * @minimum 1
   * @maximum 99
   * @type integer
   */
  amount: number;
}