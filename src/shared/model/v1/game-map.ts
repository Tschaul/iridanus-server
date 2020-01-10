import { GameState } from "./state";

export interface GameMap {
  id: string;
  name: string;
  final: boolean;
  initialState: GameState;
  seats: string[];
}
