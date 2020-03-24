import { injectable } from "inversify";
import { Logger } from "./logger";
import { GameEvent } from "../events/event";
import { GameNotification } from "../../shared/model/v1/notification";
import { Subject } from "rxjs";

@injectable()
export class NotificationHandler {

  private notifications$$ = new Subject<GameNotification>();
  public notifications$ = this.notifications$$.asObservable();

  constructor(private logger: Logger) { }

  handleNotifications(event: GameEvent) {
    (event.notifications ?? []).forEach(notifiction => {
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