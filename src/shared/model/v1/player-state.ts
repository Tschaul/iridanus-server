export interface Player {
  playerId: string,
  status: 'PLAYING' | 'DEFEATED' | 'VICTORIOUS'
}

export type PlayerStates = {
  [playerId: string]: Player
}