import { Vec2 } from "../../math/vec2";

export interface PlayerInfo {
  id: string,
  name: string,
  color: string,
  fleetDrawingPosition: Vec2,
  state: 'JOINED' | 'READY'
}

export type PlayerInfos = {
  [id: string]: PlayerInfo
}