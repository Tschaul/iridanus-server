import { Fleet } from "./fleet";
import { World } from "./world";
import { DrawingPositions } from "./drawing-positions";

export interface Gates {
  [worldId: string]: string[]
}

export interface Universe {

  fleets: {
    [id: string]: Fleet
  },
  worlds: {
    [id: string]: World
  },
  gates: Gates,
  drawingPositions: DrawingPositions
}