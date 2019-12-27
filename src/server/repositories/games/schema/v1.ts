import { GameInfo } from "../../../../shared/model/v1/game-info";
import { GameState } from "../../../../core/state";

export interface GameInfoSchema {
  id: string;
  version: 1;
  info: GameInfo;
}

export interface GameStateSchema {
  version: 1;
  currentState: GameState;
  stateHistory: {
    [timestamp: number]: GameState
  }
}
