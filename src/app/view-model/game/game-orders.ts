import { observable, computed, reaction } from "mobx";
import { FleetOrder } from "../../../shared/model/v1/fleet-orders";
import { WorldOrder } from "../../../shared/model/v1/world-order";
import { GameViewModel } from "./game-view-model";
import { resolveFromRegistry } from "../../container-registry";
import { OrderService } from "../../client/orders/order-service";
import { GameData } from "./game-data";

export class GameOrders {

  private orderService = resolveFromRegistry(OrderService);

  @observable private fleetOrderDrafts = new Map<string, FleetOrder[]>();
  @observable private worldOrderDrafts = new Map<string, WorldOrder[]>();

  @computed get updatedOrdersCount() {
    return this.fleetOrderDrafts.size + this.worldOrderDrafts.size;
  }

  constructor(
    private gameViewModel: GameViewModel,
    private gameData: GameData
  ) {

    reaction(
      () => this.gameViewModel.gameId,
      () => {
        this.fleetOrderDrafts.clear();
        this.worldOrderDrafts.clear();
      }
    )
  }


  public async saveOrderDrafts() {
    for (const [worldId, orderDrafts] of this.worldOrderDrafts) {
      await this.orderService.updateWorldOrders(this.gameViewModel.gameId!, worldId, orderDrafts);
    }
    this.worldOrderDrafts.clear()
    for (const [fleetid, orderDrafts] of this.fleetOrderDrafts) {
      await this.orderService.updateFleetOrders(this.gameViewModel.gameId!, fleetid, orderDrafts);
    }
    this.fleetOrderDrafts.clear()
  }

  public addFleetOrder(fleetId: string, order: FleetOrder) {
    const currentOrders = this.fleetOrderDrafts.get(fleetId) || this.gameData.fleets[fleetId].orders;
    this.fleetOrderDrafts.set(fleetId, [...currentOrders, order]);
  }

  public addWorldOrder(worldId: string, order: WorldOrder) {
    const currentOrders = this.worldOrderDrafts.get(worldId) || this.gameData.worlds[worldId].orders;
    this.worldOrderDrafts.set(worldId, [...currentOrders, order]);
  }

  public orderDraftsForWorld(id: string) {
    return this.worldOrderDrafts.get(id);
  }

  public orderDraftsForFleet(id: string) {
    return this.fleetOrderDrafts.get(id);
  }

  public deleteWorldOrder(worldId: string, index: number) {
    const currentOrders = this.worldOrderDrafts.get(worldId) || this.gameData.worlds[worldId].orders;
    this.worldOrderDrafts.set(worldId, currentOrders.filter((_, i) => i !== index));
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

  public updateWorldOrders(fleetId: string, orders: WorldOrder[]) {
    this.worldOrderDrafts.set(fleetId, orders);
  }
}