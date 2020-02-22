import { GameViewModel } from "./game-view-model";
import { computed, observable, reaction } from "mobx";
import { OrderService } from "../../client/orders/order-service";
import { resolveFromRegistry } from "../../container-registry";
import { WarpOrder, FleetOrder } from "../../../shared/model/v1/fleet-orders";
import { WorldOrder } from "../../../shared/model/v1/world-order";

export class OrderEditorViewModel {

  private orderService = resolveFromRegistry(OrderService)

  @observable private fleetOrderDrafts = new Map<string, FleetOrder[]>();
  @observable private worldOrderDrafts = new Map<string, WorldOrder[]>();

  constructor(private gameViewModel: GameViewModel) {
    reaction(
      () => this.gameViewModel.gameId,
      () => {
        this.fleetOrderDrafts.clear();
        this.worldOrderDrafts.clear();
      }
    )
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

  @computed get orders(): FleetOrder[] | WorldOrder[] {

    switch (this.selectionType) {
      case 'FLEET':
        if (!this.gameViewModel.selectedFleetdId || !this.gameViewModel.selectedFleet) {
          return [];
        }
        return this.fleetOrderDrafts.get(this.gameViewModel.selectedFleetdId) || this.gameViewModel.selectedFleet.orders;
      case 'WORLD':
        if (!this.gameViewModel.selectedWorld) {
          return [];
        }
        return this.worldOrderDrafts.get(this.gameViewModel.selectedWorld.id) || this.gameViewModel.selectedWorld!.orders;
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

      const orders = [...fleet.orders, warpOrder]

      this.fleetOrderDrafts.set(fleet.id, orders);
    })
  }

}