import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";
import { OrderService } from "../../client/orders/order-service";
import { resolveFromRegistry } from "../../container-registry";
import { WarpOrder } from "../../../shared/model/v1/fleet-orders";

export class OrderEditorViewModel {

  private orderService = resolveFromRegistry(OrderService)

  constructor(private gameViewModel: GameViewModel) { }

  @computed get selectionType() {
    if (this.gameViewModel.selectedFleet) {
      return 'FLEET';
    } else if (this.gameViewModel.selectedWorld) {
      return 'WORLD';
    } else {
      return 'NONE'
    }
  }

  @computed get orders() {
    switch (this.selectionType) {
      case 'FLEET':
        return this.gameViewModel.selectedFleet!.orders;
      case 'WORLD':
        return this.gameViewModel.selectedWorld!.orders;
      default:
        return [];
    }
  }

  public newWarpOrder() {
    this.gameViewModel.requestWorldTargetSelection('Select warp target!', (worldId) => {

      const gameId = this.gameViewModel.gameId!;
      const fleet = this.gameViewModel.selectedFleet!;

      const warpOrder: WarpOrder = {
        type: 'WARP',
        targetWorldId: worldId
      }

      const orders = [...fleet.orders, warpOrder]

      this.orderService.updateFleetOrders(gameId, fleet.id, orders);
    })
  }

}