import { injectable } from "inversify";
import { NotificationHandler } from "../../core/infrastructure/notification-handler";
import { windowWhen, debounceTime, toArray, mergeMap } from "rxjs/operators";

import { GameSetupProvider } from "../../core/game-setup-provider";
import { GlobalErrorHandler } from "../infrastructure/error-handling/global-error-handler";
import { NotificationMessage } from "./notification-message";
import { Subscription } from "rxjs";
import { Environment } from "../environment/environment";

@injectable()
export class NotificationMessageHandler {
  subscription: Subscription;
  constructor(
    private notificationHandler: NotificationHandler,
    private setup: GameSetupProvider,
    private errorHandler: GlobalErrorHandler,
    private notification: NotificationMessage,
    private environment: Environment
  ) {
  }

  start() {
    this.subscription = this.notificationHandler.notifications$.pipe(
      windowWhen(() => this.notificationHandler.notifications$.pipe(debounceTime(this.environment.millisecondsPerDay / 24))),
      mergeMap(x => x.pipe(toArray()))
    ).subscribe((notifications) => {
      this.errorHandler.catchPromise((async () => {
        const byPlayerId = groupBy(notifications, 'playerId');
        for (const playerId of Object.getOwnPropertyNames(byPlayerId)) {
          const notifications = byPlayerId[playerId];
          await this.notification.send(playerId, this.setup.gameId, notifications)
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