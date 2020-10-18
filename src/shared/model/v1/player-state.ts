export interface Player {
  playerId: string,
  status: 'PLAYING' | 'DEFEATED' | 'VICTORIOUS',
  hasSurrendered?: boolean
}

export type PlayerStates = {
  [playerId: string]: Player
}