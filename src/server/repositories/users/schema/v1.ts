export type User = UnconfirmedUser | ConfirmedUser;

export interface UserBase {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
}

export interface UnconfirmedUser extends UserBase {
  emailConfirmationToken: string,
  emailConfirmed: false
}

export interface ConfirmedUser extends UserBase {
  emailConfirmationTimestamp: number,
  emailConfirmed: true
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