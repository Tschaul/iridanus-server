import { observable, computed } from "mobx";
import { MainViewModel } from "../main-view-model";
import { GameStageViewModel } from "./game-stage-view-model";
import { WarpingFleet } from "../../../shared/model/v1/fleet";
import { SelectedWorldViewModel } from "./selected-world-view-model";
import { OrderEditorViewModel } from "./order-editor-view-model";
import { GameOrders } from "./game-orders";
import { GameData } from "./game-data";

export type StageSelection = {
  type: 'WORLD',
  id: string
} | {
  type: 'GATE',
  id1: string,
  id2: string
} | {
  type: 'NONE'
}

export type FleetByTwoWorlds = {
  [worldId1: string]: {
    [worldId2: string]: WarpingFleet[];
  };
};

export class GameViewModel {


  gameData = new GameData(this);
  gameOrders = new GameOrders(this, this.gameData);

  gameStageViewModel = new GameStageViewModel(this, this.gameData);
  selectedWorldViewModel = new SelectedWorldViewModel(this, this.gameData);
  orderEditorViewModel = new OrderEditorViewModel(this, this.gameOrders);

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

  @computed public get selectedWorld() {
    if (this.stageSelection.type === 'WORLD') {
      const world = this.gameData.worlds[this.stageSelection.id];
      const orderDrafts = this.gameOrders.orderDraftsForWorld(this.stageSelection.id);
      if (orderDrafts) {
        return {
          ...world,
          orders: orderDrafts
        }
      } else {
        return world
      }
    } else {
      return null;
    }
  }

  @computed get selectedFleet() {
    if (this.selectedFleetdId) {
      const fleet = this.gameData.fleets[this.selectedFleetdId];
      const orderDrafts = this.gameOrders.orderDraftsForFleet(this.selectedFleetdId);
      if (orderDrafts) {
        return {
          ...fleet,
          orders: orderDrafts
        }
      } else {
        return fleet
      }
    } else {
      return null;
    }
  }

  @observable public stageSelection: StageSelection = { type: 'NONE' };

  @observable public selectedFleetdId: string | null = null;

  @computed public get selfPlayerId(): string {
    if (!this.mainViewModel.loggedInUserId) {
      throw new Error('User is not logged in.');
    }
    return this.mainViewModel.loggedInUserId;
  }

  backToLobby() {
    this.mainViewModel.activeGameId = null;
  }


  requestWorldTargetSelection(description: string, callback: (worldId: string) => void) {
    this.gameStageViewModel.requestWorldTargetSelection(description, callback);
  }
}