import { GameViewModel } from "./game-view-model";
import { computed, observable, reaction } from "mobx";
import { OrderService } from "../../client/orders/order-service";
import { resolveFromRegistry } from "../../container-registry";
import { WarpOrder, FleetOrder } from "../../../shared/model/v1/fleet-orders";
import { WorldOrder } from "../../../shared/model/v1/world-order";
import { GameOrders } from "./game-orders";

export class OrderEditorViewModel {

  constructor(
    private gameViewModel: GameViewModel,
    private gameOrders: GameOrders,
  ) {
  }

  @computed get selectionType() {
    if (this.gameViewModel.selectedFleet) {
      return 'FLEET';
    } else if (this.gameViewModel.selectedWorld) {
      return 'WORLD';
    } else {
      return 'NONE'
    }
  }

  @computed get selectedWorldOrFleetId() {
    if (this.gameViewModel.selectedFleet) {
      return this.gameViewModel.selectedFleet.id;
    } else if (this.gameViewModel.selectedWorld) {
      return this.gameViewModel.selectedWorld.id;
    } else {
      return null
    }
  }

  @computed get selectedWorldOrFleetIsOwnedByUser() {
    if (this.gameViewModel.selectedFleet) {
      const fleet = this.gameViewModel.selectedFleet;
      return fleet.status !== 'LOST' && fleet.ownerId === this.gameViewModel.selfPlayerId;
    } else if (this.gameViewModel.selectedWorld) {
      const world = this.gameViewModel.selectedWorld;
      return world.status !== 'LOST' && world.ownerId === this.gameViewModel.selfPlayerId;
    } else {
      return true
    }
  }

  @computed get orders(): FleetOrder[] | WorldOrder[] {

    switch (this.selectionType) {
      case 'FLEET':
        if (!this.gameViewModel.selectedFleetdId || !this.gameViewModel.selectedFleet) {
          return [];
        }
        return this.gameViewModel.selectedFleet.orders
      case 'WORLD':
        if (!this.gameViewModel.selectedWorld) {
          return [];
        }
        return this.gameViewModel.selectedWorld!.orders;
      default:
        return [];
    }
  }

  public newWarpOrder() {
    this.gameViewModel.requestWorldTargetSelection('Select warp target!', (worldId) => {

      const fleet = this.gameViewModel.selectedFleet!;

      const warpOrder: WarpOrder = {
        type: 'WARP',
        targetWorldId: worldId
      }

      this.gameOrders.addFleetOrder(fleet.id, warpOrder);
    })
  }

}