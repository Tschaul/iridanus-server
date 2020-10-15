export type User = UnconfirmedUser | ConfirmedUser;

export interface Token {
  name: string,
  validUntil: number
}

export interface UserBase {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  authTokens: Token[]
}

export interface UnconfirmedUser extends UserBase {
  emailConfirmationToken: string,
  emailConfirmed: false
}

export interface ConfirmedUser extends UserBase {
  emailConfirmationTimestamp: number,
  emailConfirmed: true,
  passwordResetToken: string,
  passwortResetTokenValidUntil: number,
  telegram: TelegramChat
}

export type TelegramChat = {
  confirmed: false,
  code: string,
} | {
  confirmed: true,
  chatId: number
}

export interface UsersSchema {
  version: 1;
  pepper: string;
  users: {
    [id: string]: User
  }
}

export function initialData(pepper: string): UsersSchema {
  return {
    version: 1,
    pepper,
    users: {}
  }
}