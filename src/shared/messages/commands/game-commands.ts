
export type GameCommand = CreateGameCommand
  | SetRulesForGameCommand
  | SetMapForGameCommand
  | JoinGameCommand
  | ReadyForGameCommand;

export interface CreateGameCommand {
  type: 'GAME/CREATE',
  gameId: string
}

export interface SetRulesForGameCommand {
  type: 'GAME/SET_RULES',
  gameId: string,
  rulesId: string,
}

export interface SetMapForGameCommand {
  type: 'GAME/SET_MAP',
  gameId: string,
  mapId: string,
}

export interface JoinGameCommand {
  type: 'GAME/JOIN',
  gameId: string
}

export interface ReadyForGameCommand {
  type: 'GAME/READY',
  gameId: string
}