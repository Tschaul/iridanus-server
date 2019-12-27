import { PlayerInfo } from "./player-info";

export interface GameInfo {
  state: 'PROPOSED' | 'STARTED' | 'ENDED';
  mapId: string;
  rulesId: string;
  players: PlayerInfo;
}