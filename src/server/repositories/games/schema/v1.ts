import { GameInfo } from "../../../../shared/model/v1/game-info";
import { GameState } from "../../../../shared/model/v1/state";

export interface GameInfoSchema {
  version: 1;
  info: GameInfo;
}

export interface GameStateSchema {
  version: 1;
  currentState: GameState;
}

export interface GameHistorySchema {
  version: 1;
  stateHistory: {
    [timestamp: number]: GameState
  }
}

export interface GameLogSchema {
  version: 1;
  actionLog: {
    [timestamp: number]: string
  }
}
