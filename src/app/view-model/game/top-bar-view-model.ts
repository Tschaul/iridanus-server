import { GameOrders } from "./game-orders";
import { GameStats, StatType } from "./game-stats";
import { observable, computed } from "mobx";
import { GameViewModel } from "./game-view-model";
import { GameData } from "./game-data";
import { GameClock } from "./clock";

export class TopBarViewModel {
  constructor(
    private gameViewModel: GameViewModel,
    private clock: GameClock,
    private gameData: GameData,
    private gameOrders: GameOrders,
    private gameStats: GameStats
  ) {

  }

  @computed get gameStartTimestamp() {
    return this.gameData.gameStartTimestamp;
  }

  @computed get gameId() {
    return this.gameViewModel.gameId;
  }
  @computed get selfIsSpectator(): boolean {
    return this.gameViewModel.isReplayMode
  }

  @computed public get isConnected() {
    return this.gameViewModel.isConnected;
  }

  @computed get updatedOrdersCount() {
    return this.gameOrders.updatedOrdersCount
  }

  @computed get totalStats() {
    return this.gameStats.totalStats
  }

  @computed get fixedTimeDisplay(): string | null {
    const time = this.clock.fixedTimestamp;
    if (!time) {
      return null
    }
    return new Date(time).toLocaleString()
  }

  public saveOrderDrafts() {
    this.gameOrders.saveOrderDrafts();
  }

  public clearOrderDrafts() {
    this.gameOrders.clearOrderDrafts();
  }

  public highlightStat(type: StatType) {
    this.gameStats.highlightedStat = type;
  }

  public backToLobby(){
    this.gameOrders.saveOrderDrafts();
    this.gameViewModel.backToLobby();
  }

  public openAnalyticsPanel() {
    this.gameViewModel.analyticsPanelIsOpen = true;
  }

}