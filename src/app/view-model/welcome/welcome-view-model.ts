import { MainViewModel } from "../main-view-model";
import { resolveFromRegistry } from "../../container-registry";
import { autorun, observable } from "mobx";
import { UserManagementService } from "../../client/user-management/user-management.service";

const IRIDANUS_AUTH_TOKEN_LOCAL_STORAGE_LOCATION = 'iridanus_auth_token';
const IRIDANUS_USER_ID_LOCAL_STORAGE_LOCATION = 'iridanus_user_id';

export type WelcomScreenMode = 'LOGIN' | 'SIGN_UP' | 'CONFIRM_EMAIL' | 'EMAIL_CONFIRMED' | 'RESET_PASSWORD_MAIL_SENT' | 'RESET_PASSWORD' | 'FORGOT_PASSWORD'

export class WelcomeViewModel {

  private userManagementervice = resolveFromRegistry(UserManagementService);

  constructor(private mainViewModel: MainViewModel) {
  }

  @observable
  loginError = false;

  @observable
  mode: WelcomScreenMode = 'LOGIN'

  @observable
  username: string = ''

  @observable
  password: string = ''

  @observable
  passwordRepeated: string = ''

  @observable
  email: string = ''

  public resetPasswordToken: string = '';

  async focus() {
    if (this.mode === 'LOGIN') {
      const authToken = window.localStorage.getItem(IRIDANUS_AUTH_TOKEN_LOCAL_STORAGE_LOCATION);
      const userId = window.localStorage.getItem(IRIDANUS_USER_ID_LOCAL_STORAGE_LOCATION);
      if (authToken && userId) {
        await this.userManagementervice.useAuthToken(userId, authToken)
        this.mainViewModel.loggedInUserId = userId;
        this.loginError = false;
      }
    }
  }

  async confirmEmail(userId: string, token: string) {
    await this.userManagementervice.confirmEmail(userId, token);
    this.mode = 'EMAIL_CONFIRMED'
    this.username = userId;
  }

  async prepareResetPassword(userId: string, token: string) {
    this.resetPasswordToken = token;
    this.username = userId;
    this.mode = 'RESET_PASSWORD'
  }

  async resetPassword() {
    if (this.password && this.password === this.passwordRepeated) {
      await this.userManagementervice.resetPassword(this.username, this.resetPasswordToken, this.password)
      this.mode = 'LOGIN'
    }
  }

  async forgotPassword() {
    await this.userManagementervice.forgotPassword(this.username);
    this.mode = 'RESET_PASSWORD_MAIL_SENT'
  }

  async login() {
    try {
      const token = await this.userManagementervice.login(this.username, this.password)
      if (token) {
        window.localStorage.setItem(IRIDANUS_USER_ID_LOCAL_STORAGE_LOCATION, this.username);
        window.localStorage.setItem(IRIDANUS_AUTH_TOKEN_LOCAL_STORAGE_LOCATION, token);
      }
      this.mainViewModel.loggedInUserId = this.username;
      this.loginError = false;
    } catch {
      this.loginError = true;
    }
  }

  async logout() {
    const authToken = window.localStorage.getItem(IRIDANUS_AUTH_TOKEN_LOCAL_STORAGE_LOCATION);
    const userId = window.localStorage.getItem(IRIDANUS_USER_ID_LOCAL_STORAGE_LOCATION);
    if (authToken && userId) {
      this.userManagementervice.logout(userId, authToken);
      window.localStorage.removeItem(IRIDANUS_USER_ID_LOCAL_STORAGE_LOCATION);
      window.localStorage.removeItem(IRIDANUS_AUTH_TOKEN_LOCAL_STORAGE_LOCATION);
    }
    this.username = ''
    this.password = ''
    this.passwordRepeated = ''
    this.email = ''
    this.mode = 'LOGIN'
  }

  async signUp() {
    if (this.password && this.password === this.passwordRepeated) {
      await this.userManagementervice.signUp(this.username, this.email, this.password)

      this.mode = 'CONFIRM_EMAIL'
    }
  }

}