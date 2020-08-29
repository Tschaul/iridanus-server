export type FleetOrder =
  AwaitCaptureOrder
  | WarpOrder

export interface AwaitCaptureOrder {
  type: 'AWAIT_CAPTURE',
}

export interface WarpOrder {
  type: 'WARP',
  targetWorldId: string;
}