export type FleetOrder =
  AwaitCaptureOrder
  | WarpOrder
  | LoadMetalOrder
  | DropMetalOrder
  | LoadPopulationOrder
  | DropPopulationOrder

export interface AwaitCaptureOrder {
  type: 'AWAIT_CAPTURE',
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

export interface LoadPopulationOrder {
  type: 'LOAD_POPULATION',
  /**
   * @minimum 1
   * @maximum 99
   * @type integer
   */
  amount: number;
}

export interface DropPopulationOrder {
  type: 'DROP_POPULATION',
  /**
   * @minimum 1
   * @maximum 99
   * @type integer
   */
  amount: number;
}