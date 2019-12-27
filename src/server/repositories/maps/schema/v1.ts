import { GameState } from "../../../../core/state";

export interface MapSchema {
  id: string;
  name: string;
  final: boolean;
  initialState: GameState;
  seats: string[];
}
