import { resolveFromRegistry } from "../../container-registry";
import { NotificationService } from "../../client/notifications/notification-service";
import { GameViewModel } from "./game-view-model";
import { empty } from "rxjs";
import { IStreamListener, fromStream } from "mobx-utils";
import { GameNotification, PersistedGameNotification } from "../../../shared/model/v1/notification";
import { computed, observable } from "mobx";

export type NotificationsByWorldId = {
  [worldId: string]: PersistedGameNotification[]
};

export class GameNotifications {

  private notificationService = resolveFromRegistry(NotificationService);

  constructor(private gameViewModel: GameViewModel) {

  }

  @observable private notificationsStream: IStreamListener<PersistedGameNotification[]> = fromStream(empty(), []);

  @computed public get notificationsByWorldId() {
    const notifications = this.notificationsStream.current;

    const result: NotificationsByWorldId = {}

    for (const notification of notifications) {
      if ('worldId' in notification) {
        result[notification.worldId] = result[notification.worldId] || [];
        result[notification.worldId].push(notification)
      }
    }
    return result;
  }

  public async markWorldAsRead(worldId: string) {
    const notifications = this.notificationsByWorldId[worldId];
    const gameId = this.gameViewModel.gameId as string;
    const notificationIds = notifications.filter(it => !it.markedAsRead).map(it => it.id);
    await this.notificationService.markNotificationsAsRead(gameId, notificationIds)
  }

  focus() {
    const gameId = this.gameViewModel.gameId as string;
    this.notificationsStream = fromStream(this.notificationService.getNotificationsForGameById(gameId), []);
  }

  unfocus() {
    this.notificationsStream.dispose();
  }
}