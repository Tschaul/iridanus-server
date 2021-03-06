import { injectable } from "inversify";
import { Logger } from "./logger";
import { GameEvent } from "../events/event";
import { GameNotification } from "../../shared/model/v1/notification";
import { Subject } from "rxjs";

@injectable()
export class NotificationHandler {

  private notifications$$ = new Subject<GameNotification>();
  public notifications$ = this.notifications$$.asObservable();

  constructor(protected logger: Logger) { }

  handleNotifications(event: GameEvent, timestamp: number) {
    const notifications = event.notifications ? event.notifications(timestamp) : [];
    notifications.filter(it => !it.playerId.startsWith('@')).forEach(notifiction => {
      this.notifications$$.next(notifiction);
      this.logger.info('GameNotification: ' + JSON.stringify(notifiction))
    })
  }
}

export class SilentNotificationHandler extends NotificationHandler {
  handleNotifications(event: GameEvent) {
    return;
  }
}