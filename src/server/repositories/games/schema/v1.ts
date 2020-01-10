import { GameInfo } from "../../../../shared/model/v1/game-info";
import { GameState } from "../../../../shared/model/v1/state";

export interface GameInfoSchema {
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
