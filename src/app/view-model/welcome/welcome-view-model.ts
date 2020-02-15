import { MainViewModel } from "../main-view-model";
import { resolveFromRegistry } from "../../container-registry";
import { observable } from "mobx";
import { UserManagementService } from "../../client/user-management/user-management.service";

export type WelcomScreenMode = 'LOGIN' | 'SIGN_UP'

export class WelcomeViewModel {

  private userManagementervice = resolveFromRegistry(UserManagementService);

  constructor(private mainViewModel: MainViewModel) { }

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

  async login() {
    await this.userManagementervice.login(this.username, this.password)
    this.mainViewModel.loggedInUserId = this.username;
  }

  async signUp() {
    if (this.password === this.passwordRepeated) {
      await this.userManagementervice.signUp(this.username, this.email, this.password)
    }
  }

}