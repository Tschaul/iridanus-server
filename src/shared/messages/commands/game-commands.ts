
export type GameCommand = CreateGameCommand
  | JoinGameCommand
  | ReadyForGameCommand;

export interface CreateGameCommand {
  type: 'GAME/CREATE',
  gameId: string
}

export interface JoinGameCommand {
  type: 'GAME/JOIN',
  gameId: string
}

export interface ReadyForGameCommand {
  type: 'GAME/READY',
  gameId: string
}