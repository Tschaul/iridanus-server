import { observable, computed, reaction } from "mobx";
import { FleetOrder } from "../../../shared/model/v1/fleet-orders";
import { GameViewModel } from "./game-view-model";
import { resolveFromRegistry } from "../../container-registry";
import { OrderService } from "../../client/orders/order-service";
import { GameData } from "./game-data";
import { World } from "../../../shared/model/v1/world";

export class GameOrders {

  private orderService = resolveFromRegistry(OrderService);

  @observable private fleetOrderDrafts = new Map<string, FleetOrder[]>();

  @computed get updatedOrdersCount() {
    return this.fleetOrderDrafts.size;
  }

  constructor(
    private gameViewModel: GameViewModel,
    private gameData: GameData
  ) {

    reaction(
      () => this.gameViewModel.gameId,
      () => {
        this.fleetOrderDrafts.clear();
      }
    )
  }

  public async saveOrderDrafts() {
    for (const [fleetid, orderDrafts] of this.fleetOrderDrafts) {
      await this.orderService.updateFleetOrders(this.gameViewModel.gameId!, fleetid, orderDrafts);
    }
    this.fleetOrderDrafts.clear()
  }

  public addFleetOrder(fleetId: string, order: FleetOrder) {
    const currentOrders = this.fleetOrderDrafts.get(fleetId) || this.gameData.fleets[fleetId].orders;
    this.fleetOrderDrafts.set(fleetId, [...currentOrders, order]);
  }

  public orderDraftsForFleet(id: string) {
    return this.fleetOrderDrafts.get(id);
  }

  public deleteFleetOrder(fleetId: string, index: number) {
    const currentOrders = this.fleetOrderDrafts.get(fleetId) || this.gameData.fleets[fleetId].orders;
    const warpOrderGetsDeleted = currentOrders[index].type === 'WARP';
    this.fleetOrderDrafts.set(fleetId, currentOrders.filter((order, i) =>
      i !== index
      && !(
        warpOrderGetsDeleted
        && order.type === 'WARP'
        && i > index
      )));
  }

  public updateFleetOrders(fleetId: string, orders: FleetOrder[]) {
    this.fleetOrderDrafts.set(fleetId, orders);
  }

  public clearFleetOrders(fleetId: string) {
    this.updateFleetOrders(fleetId, []);
  }
}