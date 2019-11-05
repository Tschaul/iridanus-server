export const CONFIG = Symbol.for("Config");

export interface GameConfig {
  buildShipDelay: number;
  transferMetalDelay: number,
  transferShipsDelay: number,
  leaveWorldDelay: number,
  warpToWorldDelay: number,
  arriveWorldDelay: number,
}