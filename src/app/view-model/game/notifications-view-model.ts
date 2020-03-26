import { GameNotifications } from "./game-notifications";
import { GameStageSelection } from "./stage-selection";
import { computed } from "mobx";

export class NotificationsViewModel {
  constructor(
    private gameNotifications: GameNotifications,
    private gameStageSelection: GameStageSelection
  ) {}

  @computed get notifications() {
    if (this.gameStageSelection.selectedWorld) {
      return this.gameNotifications.notificationsByWorldId[this.gameStageSelection.selectedWorld.id] || [];
    } else {
      return [];
    }
  }
}