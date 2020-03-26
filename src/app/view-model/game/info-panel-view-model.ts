import { GameData } from "./game-data";
import { GameNotifications } from "./game-notifications";
import { GameStageSelection } from "./stage-selection";
import { NotificationsViewModel } from "./notifications-view-model";
import { ScoringsViewModel } from "./scorings-view-model";
import { observable, when, reaction } from "mobx";

export class InfoPanelViewModel {

  notificationsViewModel = new NotificationsViewModel(this.gameNotifications, this.gameStageSelection);
  scoringsViewModel = new ScoringsViewModel(this.gameData);

  @observable displayedTab: 'NOTIFICATIONS' | 'SCORINGS' = 'SCORINGS';

  constructor(
    private gameData: GameData,
    private gameNotifications: GameNotifications,
    private gameStageSelection: GameStageSelection
  ) {

    reaction(
      () => {
        return this.notificationsViewModel.notifications
      },
      (notifications) => {
        if (notifications.length > 0) {
          this.displayedTab = 'NOTIFICATIONS';
        }
      }
    )

  }

}