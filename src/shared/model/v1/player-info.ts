import { Vec2 } from "../../math/vec2";

export interface PlayerInfo {
  id: string,
  color: string,
  fleetDrawingPosition: Vec2,
  state: 'JOINED' | 'READY',
  isSpectator: boolean
}

export type PlayerInfos = {
  [id: string]: PlayerInfo
}