export type Command =  CreateGameCommand
  | SignUpUserCommand;

export interface CreateGameCommand {
  type: 'CREATE_GAME',
}

export interface SignUpUserCommand {
  type: 'SIGN_UP_USER',
  id: string;
  email: string;
  password: string;
}