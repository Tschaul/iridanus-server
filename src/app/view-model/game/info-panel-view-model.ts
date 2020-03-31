import { GameData } from "./game-data";
import { GameNotifications } from "./game-notifications";
import { GameStageSelection } from "./stage-selection";
import { NotificationsViewModel } from "./notifications-view-model";
import { ScoringsViewModel } from "./scorings-view-model";
import { observable, when, reaction, computed } from "mobx";
import { GameViewModel } from "./game-view-model";

export class InfoPanelViewModel {

  notificationsViewModel = new NotificationsViewModel(this.gameNotifications, this.gameStageSelection);
  scoringsViewModel = new ScoringsViewModel(this, this.gameData);

  @observable displayedTab: 'NOTIFICATIONS' | 'SCORINGS' = 'SCORINGS';

  constructor(
    private gameViewModel: GameViewModel,
    private gameData: GameData,
    private gameNotifications: GameNotifications,
    private gameStageSelection: GameStageSelection
  ) {

    reaction(
      () => {
        return this.notificationsViewModel.notifications
      },
      (notifications) => {
        if (notifications.filter(it => !it.markedAsRead).length > 0) {
          this.displayedTab = 'NOTIFICATIONS';
          this.notificationsViewModel.markAsRead();
        }
      }
    )

  }

  @computed get millisecondsPerDay() {
    return this.gameViewModel.millisecondsPerDay
  }
}