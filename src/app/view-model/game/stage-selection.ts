import { computed, observable } from "mobx";
import { GameData } from "./game-data";
import { GameOrders } from "./game-orders";
import { VisibleWorld } from "../../../shared/model/v1/visible-state";
import { World } from "../../../shared/model/v1/world";

export type GameStageMode = {
  type: 'NORMAL'
} | {
  type: 'SELECT_WORLD_TARGET',
  description: string,
  callback: (worldId: string) => void
} | {
  type: 'SELECT_GATE_TARGET',
  description: string,
  callback: (world1Id: string, world2Id: string) => void
}

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

export class GameStageSelection {

  selectFleet(id: string | null) {
    this.selectedFleetdId = id;
  }

  selectGate(id1: string, id2: string) {
    if (this.mode.type === 'SELECT_GATE_TARGET') {
      this.mode.callback(id1, id2)
      this.mode = { type: 'NORMAL' }
      return;
    }
    this.stageSelection = {
      type: 'GATE',
      id1,
      id2
    }
    this.selectedFleetdId = null;
  }

  selectWorld(id: string | null) {
    if (this.mode.type === 'SELECT_WORLD_TARGET') {
      if (id) {
        this.mode.callback(id);
      }
      this.mode = { type: 'NORMAL' }
      return;
    }
    if (id) {
      this.stageSelection = {
        type: 'WORLD',
        id
      }
    } else {
      this.stageSelection = {
        type: 'NONE',
      }
    }
    this.selectedFleetdId = null;
  }

  @observable public mode: GameStageMode = { type: 'NORMAL' };

  public requestWorldTargetSelection(description: string, callback: (worldId: string) => void) {
    this.mode = {
      type: 'SELECT_WORLD_TARGET',
      description,
      callback
    }
  }

  public requestGateTargetSelection(description: string, callback: (world1Id: string, world2Id: string) => void) {
    this.mode = {
      type: 'SELECT_GATE_TARGET',
      description,
      callback
    }
  }

  constructor(
    private gameData: GameData,
    private gameOrders: GameOrders
  ) {

  }

  @computed public get selectedWorld(): VisibleWorld | null {
    if (this.stageSelection.type === 'WORLD') {
      const world = this.gameData.worlds[this.stageSelection.id];
      const orderDrafts = this.gameOrders.orderDraftsForWorld(this.stageSelection.id);
      if (orderDrafts) {
        return {
          ...world,
          orders: orderDrafts
        } as World;
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

}