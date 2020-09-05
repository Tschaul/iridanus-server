export type FleetOrder =
  AwaitCaptureOrder
  | WarpOrder
  | StartCargoMissionOrder
  | SplitFleetOrder
  | DeployToWorldOrder

export interface AwaitCaptureOrder {
  type: 'AWAIT_CAPTURE',
}

export interface WarpOrder {
  type: 'WARP',
  targetWorldId: string;
}

export interface StartCargoMissionOrder {
  type: 'START_CARGO_MISSION',
  otherWorldId: string;
}

export interface SplitFleetOrder {
  type: 'SPLIT_FLEET',
}

export interface DeployToWorldOrder {
  type: 'DEPLOY_TO_WORLD',
}