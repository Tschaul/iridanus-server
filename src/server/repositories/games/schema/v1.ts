import { GameInfo, GameMetaData } from "../../../../shared/model/v1/game-info";
import { GameState } from "../../../../shared/model/v1/state";
import { PersistedGameNotification } from "../../../../shared/model/v1/notification";

export interface GameInfoSchema {
  version: 1;
  info: GameInfo;
}

export interface GameStateSchema {
  version: 1;
  currentState: GameState;
}

export interface GameMetaDataSchema {
  version: 1;
  data: GameMetaData;
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
    [timestamp: number]: string[]
  }
}

export interface GameNotificationsSchema {
  version: 1;
  notifications: {
    [playerId: string]: PersistedGameNotification[]
  }
}
