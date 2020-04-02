import { PlayerInfos } from "./player-info";
import { DrawingPositions } from "./drawing-positions";

export type GameInfo = ProposedGameInfo | StartedGameInfo;

// TODO new status: PROPOSED -> SCHEDULED -> STARTED -> ENDED

export interface GameInfoBase {
  id: string;
  players: PlayerInfos;
}

export interface ProposedGameInfo extends GameInfoBase {
  state: 'PROPOSED';
}

export interface StartedGameInfo extends GameInfoBase {
  state: 'STARTED' | 'ENDED';
}

export interface GameMetaData {
  drawingPositions: DrawingPositions
}