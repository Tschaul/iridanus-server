import { PlayerInfos } from "./player-info";

export type GameInfo = ProposedGameInfo | StartedGameInfo;

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