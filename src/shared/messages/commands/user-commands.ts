

export interface SignUpUserCommand {
  type: 'SIGN_UP_USER',
  id: string;
  email: string;
  password: string;
}