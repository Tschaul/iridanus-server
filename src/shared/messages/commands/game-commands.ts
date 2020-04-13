
export type GameCommand = CreateGameCommand
  | JoinGameCommand
  | ReadyForGameCommand
  | ToggleSpectatorForGameCommand;

export interface CreateGameCommand {
  type: 'GAME/CREATE',
  gameId: string
}

export interface JoinGameCommand {
  type: 'GAME/JOIN',
  gameId: string
}

export interface ToggleSpectatorForGameCommand {
  type: 'GAME/TOGGLE_SPECTATOR',
  gameId: string
}

export interface ReadyForGameCommand {
  type: 'GAME/READY',
  gameId: string
}