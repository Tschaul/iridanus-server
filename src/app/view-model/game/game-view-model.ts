import { observable, computed } from "mobx";
import { MainViewModel } from "../main-view-model";
import { GameStageViewModel } from "./game-stage-view-model";
import { SelectedWorldViewModel } from "./selected-world-view-model";
import { OrderEditorViewModel } from "./order-editor-view-model";
import { GameOrders } from "./game-orders";
import { GameData } from "./game-data";
import { GameStageSelection } from "./stage-selection";
import { WorldHints } from "./world-hints";
import { GameStats } from "./game-stats";
import { TopBarViewModel } from "./top-bar-view-model";
import { ScoringsViewModel } from "./scorings-view-model";
import { GameNotifications } from "./game-notifications";
import { InfoPanelViewModel } from "./info-panel-view-model";


export class GameViewModel {

  gameData = new GameData(this);
  gameNotifications = new GameNotifications(this);
  gameOrders = new GameOrders(this, this.gameData);
  selection = new GameStageSelection(this.gameData, this.gameOrders);
  worldHints = new WorldHints();
  gameStats = new GameStats(this, this.gameData, this.worldHints);

  gameStageViewModel = new GameStageViewModel(this.gameData, this.selection, this.worldHints, this.gameNotifications);
  selectedWorldViewModel = new SelectedWorldViewModel(this.gameData, this.selection);
  orderEditorViewModel = new OrderEditorViewModel(this, this.gameOrders, this.selection, this.worldHints);
  topBarViewModel = new TopBarViewModel(this, this.gameData, this.gameOrders, this.gameStats);
  infoPanelViewModel = new InfoPanelViewModel(this, this.gameData, this.gameNotifications, this.selection);

  @computed public get gameId() {
    return this.mainViewModel.activeGameId;
  }

  @computed public get isConnected() {
    return this.mainViewModel.connectionStatus.isConnected;
  }

  @computed public get millisecondsPerDay() {
    return this.mainViewModel.environment.environmentInfo.millisecondsPerDay;
  }

  constructor(private mainViewModel: MainViewModel) {
  }

  public focus() {
    this.gameData.focus();
    this.gameNotifications.focus();
  }

  public unfocus() {
    this.gameData.unfocus();
    this.gameNotifications.unfocus();
  }

  @computed public get selfPlayerId(): string {
    if (!this.mainViewModel.loggedInUserId) {
      throw new Error('User is not logged in.');
    }
    return this.mainViewModel.loggedInUserId;
  }

  backToLobby() {
    this.mainViewModel.activeGameId = null;
  }
}