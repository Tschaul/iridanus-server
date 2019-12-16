import { Vec2 } from "../math/vec2";

export interface PlayerInfo {
  name: string,
  color: string,
  fleetDrawingPosition: Vec2,
}

export type PlayerInfos = {
  [id: string]: PlayerInfo
}