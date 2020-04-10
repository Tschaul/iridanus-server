import { injectable } from "inversify";
import { NotificationHandler } from "../../core/infrastructure/notification-handler";
import { bufferTime } from "rxjs/operators";

import { GameSetupProvider } from "../../core/game-setup-provider";
import { GlobalErrorHandler } from "../infrastructure/error-handling/global-error-handler";
import { NotificationMail } from "./notification-mail";
import { Subscription } from "rxjs";

@injectable()
export class NotificationMailer {
  subscription: Subscription;
  constructor(
    private notificationHandler: NotificationHandler,
    private setup: GameSetupProvider,
    private errorHandler: GlobalErrorHandler,
    private notificationMail: NotificationMail
  ) {
  }

  start() {
    console.log("starting to send notification mails for game "+ this.setup.gameId)
    this.subscription = this.notificationHandler.notifications$.pipe(
      bufferTime(0),
    ).subscribe(notifications => {
      this.errorHandler.catchPromise((async () => {
        const byPlayerId = groupBy(notifications, 'playerId');
        for (const playerId of Object.getOwnPropertyNames(byPlayerId)) {
          const notifications = byPlayerId[playerId];
          await this.notificationMail.send(playerId, this.setup.gameId, notifications)
        }
      })())
    })
  }

  stop() {
    this.subscription.unsubscribe();
  }
}

const groupBy = (xs: any, key: string) => {
  return xs.reduce((rv: any, x: any) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};