import { Fleet } from "./fleet";
import { World } from "./world";
import { WorldVisibilityStatus } from "./visibility-status";

export interface Gates {
  [worldId: string]: string[]
}

export interface PlayerVisibilityStatus {
  [playerId: string]: {
    [worldId: string]: WorldVisibilityStatus
  }
}

export interface Universe {

  fleets: {
    [id: string]: Fleet
  },
  worlds: {
    [id: string]: World
  },
  gates: Gates,
  visibility: PlayerVisibilityStatus
}
