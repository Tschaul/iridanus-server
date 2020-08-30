export type FleetOrder =
  AwaitCaptureOrder
  | WarpOrder
  | StartCargoMissionOrder

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