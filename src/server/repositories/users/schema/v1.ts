export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
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