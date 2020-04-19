import { GameNotifications } from "./game-notifications";
import { GameStageSelection } from "./stage-selection";
import { computed } from "mobx";

export class NotificationsViewModel {
  constructor(
    private gameNotifications: GameNotifications,
    private gameStageSelection: GameStageSelection
  ) { }

  @computed get notifications() {
    if (this.gameStageSelection.selectedWorld) {
      const notifications = this.gameNotifications.notificationsByWorldId[this.gameStageSelection.selectedWorld.id] || [];
      return notifications.slice(0).sort((a,b) => b.timestamp - a.timestamp)
    } else {
      return [];
    }
  }

  public async markAsRead() {
    if (this.gameStageSelection.selectedWorld) {
      await this.gameNotifications.markWorldAsRead(this.gameStageSelection.selectedWorld.id)
    }
  }
}