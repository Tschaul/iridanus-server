export type UserCommand = SignUpUserCommand
  | ConfirmEmailAddressCommand
  | SendPasswordResetTokenCommand
  | ResetPasswordCommand;

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

export interface SendPasswordResetTokenCommand {
  type: 'USER/SEND_PASSWORD_RESET_TOKEN',
  id: string;
}

export interface ResetPasswordCommand {
  type: 'USER/RESET_PASSWORD',
  id: string;
  token: string;
  password: string;
}