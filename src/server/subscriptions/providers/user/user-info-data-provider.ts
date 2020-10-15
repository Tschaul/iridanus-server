import { Observable, of } from "rxjs";
import { injectable } from "inversify";
import { DataProvider } from "../data-provider";
import { Environment } from "../../../environment/environment";
import { EnvironmentInfoSubscription } from "../../../../shared/messages/subscriptions/environment-subscriptions";
import { EnvironmentInfoSubscriptionResult } from "../../../../shared/messages/subscriptions/environment-subscription-results";
import { UserInfoSubscription } from "../../../../shared/messages/subscriptions/user-subscriptions";
import { UserInfoSubscriptionResult } from "../../../../shared/messages/subscriptions/user-subscription-results";
import { UserRepository } from "../../../repositories/users/user-repository";
import { map } from "rxjs/operators";

@injectable()
export class UserInfoDataProvider implements DataProvider {
  authenticationRequired = true;

  constructor(
    private userRepository: UserRepository,
  ) { }

  getObservable(subscription: UserInfoSubscription, userId: string): Observable<UserInfoSubscriptionResult> {

    return this.userRepository.getUserInfo(userId).pipe(map(user => {
      return {
        type: 'USER/INFO',
        info: {
          userId: user?.id ?? '',
          email: user?.email ?? '',
          emailConfirmed: user?.emailConfirmed ?? false,
          telegramConfirmed: (user?.emailConfirmed && user.telegram.confirmed) ?? false,
          telegramCode: (user?.emailConfirmed && !user.telegram.confirmed) ? user.telegram.code : undefined,
        }
      }
    }))
  }
}