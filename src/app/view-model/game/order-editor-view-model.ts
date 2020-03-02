import { GameViewModel } from "./game-view-model";
import { computed, observable, reaction } from "mobx";
import { OrderService } from "../../client/orders/order-service";
import { resolveFromRegistry } from "../../container-registry";
import { WarpOrder, FleetOrder, LoadMetalOrder, LoadShipsOrder } from "../../../shared/model/v1/fleet-orders";
import { WorldOrder } from "../../../shared/model/v1/world-order";
import { GameOrders } from "./game-orders";
import { GameStageSelection } from "./stage-selection";
import { WorldHints } from "./world-hints";

export class OrderEditorViewModel {

  constructor(
    private gameViewModel: GameViewModel,
    private gameOrders: GameOrders,
    private selection: GameStageSelection,
    private worldHints: WorldHints,
  ) {
  }

  @computed get selectionType() {
    if (this.selection.selectedFleet) {
      return 'FLEET';
    } else if (this.selection.selectedWorld) {
      return 'WORLD';
    } else {
      return 'NONE'
    }
  }

  @computed get selectedWorldOrFleetId() {
    if (this.selection.selectedFleet) {
      return this.selection.selectedFleet.id;
    } else if (this.selection.selectedWorld) {
      return this.selection.selectedWorld.id;
    } else {
      return null
    }
  }

  @computed get selectedWorldOrFleetIsOwnedByUser() {
    if (this.selection.selectedFleet) {
      const fleet = this.selection.selectedFleet;
      return fleet.status !== 'LOST' && fleet.ownerId === this.gameViewModel.selfPlayerId;
    } else if (this.selection.selectedWorld) {
      const world = this.selection.selectedWorld;
      return world.status !== 'LOST' && world.ownerId === this.gameViewModel.selfPlayerId;
    } else {
      return true
    }
  }

  @computed get orders(): FleetOrder[] | WorldOrder[] {

    switch (this.selectionType) {
      case 'FLEET':
        if (!this.selection.selectedFleetdId || !this.selection.selectedFleet) {
          return [];
        }
        return this.selection.selectedFleet.orders
      case 'WORLD':
        if (!this.selection.selectedWorld) {
          return [];
        }
        return this.selection.selectedWorld!.orders;
      default:
        return [];
    }
  }

  public newWarpOrder() {
    this.selection.requestWorldTargetSelection('Select warp target!', (worldId) => {

      const fleet = this.selection.selectedFleet!;

      const warpOrder: WarpOrder = {
        type: 'WARP',
        targetWorldId: worldId
      }

      this.gameOrders.addFleetOrder(fleet.id, warpOrder);
    })
  }

  public newTransferMetalOrder(amount: number) {
      const fleet = this.selection.selectedFleet!;
      const order: LoadMetalOrder = {
        type: 'LOAD_METAL',
        amount
      }
      this.gameOrders.addFleetOrder(fleet.id, order);
  }

  public newTransferShipsOrder(amount: number) {
      const fleet = this.selection.selectedFleet!;
      const order: LoadShipsOrder = {
        type: 'LOAD_SHIPS',
        amount
      }
      this.gameOrders.addFleetOrder(fleet.id, order);
  }

  worldsWithHints: string[];

  public showHintsForOrder(order: FleetOrder | WorldOrder) {
    switch (order.type) {
      case 'WARP':
        this.worldHints.showHints([{ worldId: order.targetWorldId, hint: 'Target world' }]);
        return;
      default:
        this.worldHints.clearHints();
        return;
    }
  }

  public clearHints() {
    this.worldHints.clearHints();
  }

  deleteOrder(index: number) {
    if (this.selectionType === 'FLEET') {
      this.gameOrders.deleteFleetOrder(this.selectedWorldOrFleetId as string, index)
    }
    if (this.selectionType === 'WORLD') {
      this.gameOrders.deleteWorldOrder(this.selectedWorldOrFleetId as string, index)
    }
    this.clearHints();
  }

}