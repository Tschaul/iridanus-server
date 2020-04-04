export type UserCommand = SignUpUserCommand | ConfirmEmailAddressCommand;

export interface SignUpUserCommand {
  type: 'USER/SIGN_UP_USER',
  id: string;
  email: string;
  password: string;
}

export interface ConfirmEmailAddressCommand {
  type: 'USER/CONFIRM_EMAIL_ADDRESS',
  id: string;
  token: string;
}