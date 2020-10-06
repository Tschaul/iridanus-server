export type Credentials = {
  type: 'password',
  password: string,
  createToken?: boolean
} | {
  type: 'token',
  token: string
}