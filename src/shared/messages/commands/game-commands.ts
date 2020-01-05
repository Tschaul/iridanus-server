
export type GameCommand = CreateGameCommand;

export interface CreateGameCommand {
  type: 'CREATE_GAME',
  gameId: string
}

export interface SetRulesForGameCommand {
  type: 'SET_RULES_FOR_GAME',
  gameId: string,
  rulesId: string,
}

export interface SetMapForGameCommand {
  type: 'SET_MAP_FOR_GAME',
  gameId: string,
  rulesId: string,
}

export interface JoinGameCommand {
  type: 'JOIN_GAME',
  gameId: string
}

export interface ReadyForGameCommand {
  type: 'READY_FOR_GAME',
  gameId: string
}