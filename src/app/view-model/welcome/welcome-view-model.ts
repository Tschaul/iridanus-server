import { MainViewModel } from "../main-view-model";
import { resolveFromRegistry } from "../../container-registry";
import { observable } from "mobx";
import { UserManagementService } from "../../client/user-management/user-management.service";

export type WelcomScreenMode = 'LOGIN' | 'SIGN_UP' | 'CONFIRM_EMAIL' | 'EMAIL_CONFIRMED'

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

  async confirmEmail(userId: string, token: string) {
    await this.userManagementervice.confirmEmail(userId, token);
    this.mode = 'EMAIL_CONFIRMED'
    this.username = userId;
  }

  async login() {
    try {
      await this.userManagementervice.login(this.username, this.password)
      this.mainViewModel.loggedInUserId = this.username;
    } catch {
      this.loginError = true;
    }
  }

  async signUp() {
    if (this.password && this.password === this.passwordRepeated) {
      await this.userManagementervice.signUp(this.username, this.email, this.password)

      this.mode = 'CONFIRM_EMAIL'
    }
  }

}