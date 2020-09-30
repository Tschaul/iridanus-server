export type FleetOrder =
  WarpOrder
  | StartCargoMissionOrder
  | StopCargoMissionOrder
  | SplitFleetOrder
  | DeployToWorldOrder

export interface WarpOrder {
  type: 'WARP',
  targetWorldId: string;
}

export interface StartCargoMissionOrder {
  type: 'START_CARGO_MISSION',
  otherWorldId: string;
}

export interface StopCargoMissionOrder {
  type: 'STOP_CARGO_MISSION',
}

export interface SplitFleetOrder {
  type: 'SPLIT_FLEET',
}

export interface DeployToWorldOrder {
  type: 'DEPLOY_TO_WORLD',
}