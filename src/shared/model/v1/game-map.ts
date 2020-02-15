import { Universe } from "./universe";
import { DrawingPositions } from "./drawing-positions";

export interface GameMap {
  universe: Universe;
  seats: string[];
  drawingPositions: DrawingPositions
}
