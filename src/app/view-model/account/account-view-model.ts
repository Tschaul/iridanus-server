import { computed } from "mobx";
import { fromStream, IStreamListener } from "mobx-utils";
import { Observable } from "rxjs";
import { UserInfo } from "../../../shared/messages/subscriptions/user-subscription-results";
import { UserManagementService } from "../../client/user-management/user-management.service";
import { resolveFromRegistry } from "../../container-registry";
import { MainViewModel } from "../main-view-model";
import { ServerEnvironment } from "../server-environment";

export class AccountViewModel {
  
  private userService = resolveFromRegistry(UserManagementService);
  userInfos: IStreamListener<UserInfo>;

  constructor(private mainViewModel: MainViewModel, private environment: ServerEnvironment) {
  }

  @computed get telegramBotName() {
    return this.environment.environmentInfo.telegramBotName;
  }

  focus() {
    this.userInfos = fromStream(this.userService.userInfo$, {
      userId: "",
      email: "",
      emailConfirmed: false,
      telegramConfirmed: false
    });
  }

  unfocus() {
    this.userInfos.dispose();
  }

  public hideAccountSettings() {
    this.mainViewModel.showAccountSettings = false;
  }
}