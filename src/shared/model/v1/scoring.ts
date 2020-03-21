export interface Scoring {
  playerId: string,
  score: number,
  lastScoringTimestamp: number;
  influence: number;
}

export type Scorings = {
  [playerId: string]: Scoring
}