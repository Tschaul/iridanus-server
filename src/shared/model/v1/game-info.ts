import { PlayerInfos } from "./player-info";

export type GameInfo = ProposedGameInfo | StartedGameInfo;

export interface GameInfoBase {
  players: PlayerInfos;
}

export interface ProposedGameInfo extends GameInfoBase {
  state: 'PROPOSED';
  mapId?: string;
  rulesId?: string;
}

export interface StartedGameInfo extends GameInfoBase {
  state: 'STARTED' | 'ENDED';
  mapId: string;
  rulesId: string;
}