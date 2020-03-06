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


export class GameViewModel {

  gameData = new GameData(this);
  gameOrders = new GameOrders(this, this.gameData);
  selection = new GameStageSelection(this.gameData, this.gameOrders);
  worldHints = new WorldHints();
  gameStats = new GameStats(this, this.gameData, this.worldHints);

  gameStageViewModel = new GameStageViewModel(this.gameData, this.selection, this.worldHints);
  selectedWorldViewModel = new SelectedWorldViewModel(this.gameData, this.selection);
  orderEditorViewModel = new OrderEditorViewModel(this, this.gameOrders, this.selection, this.worldHints);
  topBarViewModel = new TopBarViewModel(this, this.gameOrders, this.gameStats);

  @computed public get gameId() {
    return this.mainViewModel.activeGameId;
  }

  constructor(private mainViewModel: MainViewModel) {
  }

  public focus() {
    this.gameData.focus();
  }

  public unfocus() {
    this.gameData.unfocus();
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