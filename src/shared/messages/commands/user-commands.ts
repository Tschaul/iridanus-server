export type UserCommand = SignUpUserCommand
  | ConfirmEmailAddressCommand
  | SendPasswordResetTokenCommand
  | ResetPasswordCommand;

export interface SignUpUserCommand {
  type: 'USER/SIGN_UP_USER',
  /**
   * @pattern ^(?=.{3,15}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$
   */
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

export interface CreateAuthTokenCommand {
  type: 'USER/CREATE_AUTH_TOKEN',
  id: string;
  token: string;
  password: string;
}