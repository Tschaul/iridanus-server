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
import { GameNotifications } from "./game-notifications";
import { InfoPanelViewModel } from "./info-panel-view-model";
import { GameClock } from "./clock";
import { PlayersViewModel } from "./player-infos-view-model";
import { AnalyticsViewModel } from "./analytics-view-model";


export class GameViewModel {

  clock = new GameClock();
  gameData = new GameData(this, this.clock);
  gameNotifications = new GameNotifications(this);
  gameOrders = new GameOrders(this, this.gameData);
  selection = new GameStageSelection(this, this.gameData, this.gameOrders);
  worldHints = new WorldHints();
  gameStats = new GameStats(this, this.gameData, this.worldHints);
  players = new PlayersViewModel(this.gameData);

  orderEditorViewModel = new OrderEditorViewModel(this, this.gameOrders, this.selection, this.worldHints, this.gameData);

  gameStageViewModel = new GameStageViewModel(this, this.gameData, this.selection, this.worldHints, this.gameNotifications, this.orderEditorViewModel, this.clock, this.players, this.mainViewModel.environment);
  selectedWorldViewModel = new SelectedWorldViewModel(this.gameData, this.selection, this.players, this.clock);
  topBarViewModel = new TopBarViewModel(this, this.clock, this.gameData, this.gameOrders, this.gameStats);
  infoPanelViewModel = new InfoPanelViewModel(this, this.gameData, this.gameNotifications, this.selection);
  analyticsViewModel = new AnalyticsViewModel(this, this.clock, this.gameData);
  
  @observable analyticsPanelIsOpen = false;
  @observable sideMenuIsOpen = false;

  @computed get playerStatus() {
    if (this.gameData.playerInfos[this.selfPlayerId] && this.gameData.playerInfos[this.selfPlayerId].isSpectator) {
      return 'SPECTATING'
    } else {
      return this.gameData.players[this.selfPlayerId]?.status
    }
  }

  @computed get isReplayMode(): boolean {
    return !!this.clock.fixedTimestamp || this.playerStatus !== 'PLAYING';
  }

  @computed public get gameId() {
    return this.mainViewModel.activeGameId;
  }

  @computed public get screenMode() {
    return this.mainViewModel.screenMode;
  }

  @computed public get screenDimensions() {
    return this.mainViewModel.screenDimensions;
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
    this.clock.focus();
    this.gameData.focus();
    this.gameNotifications.focus();
  }

  public unfocus() {
    this.clock.unfocus();
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