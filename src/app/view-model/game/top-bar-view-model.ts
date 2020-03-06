import { GameOrders } from "./game-orders";
import { GameStats, StatType } from "./game-stats";
import { observable, computed } from "mobx";
import { GameViewModel } from "./game-view-model";

export class TopBarViewModel {
  constructor(
    private gameViewModel: GameViewModel,
    private gameOrders: GameOrders,
    private gameStats: GameStats
  ) {

  }

  @computed get gameId() {
    return this.gameViewModel.gameId;
  }

  @computed get updatedOrdersCount() {
    return this.gameOrders.updatedOrdersCount
  }

  @computed get totalStats() {
    return this.gameStats.totalStats
  }

  public saveOrderDrafts() {
    this.gameOrders.saveOrderDrafts();
  }

  public highlightStat(type: StatType) {
    this.gameStats.highlightedStat = type;
  }

}