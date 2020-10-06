export interface PlayerState {
  playerId: string,
  score: number,
  lastScoringTimestamp: number;
  influence: number;
}

export type PlayerStates = {
  [playerId: string]: PlayerState
}