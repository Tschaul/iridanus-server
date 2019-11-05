export const CONFIG = Symbol.for("Config");

export interface GameConfig {
  transferMetalDelay: number,
  transferShipsDelay: number,
  leaveWorldDelay: number,
  warpToWorldDelay: number,
  arriveWorldDelay: number,
}