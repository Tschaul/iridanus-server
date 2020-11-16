import { observable, computed, reaction, autorun } from "mobx";
import { FleetOrder } from "../../../shared/model/v1/fleet-orders";
import { GameViewModel } from "./game-view-model";
import { resolveFromRegistry } from "../../container-registry";
import { OrderService } from "../../client/orders/order-service";
import { GameData } from "./game-data";

export class GameOrders {

  private orderService = resolveFromRegistry(OrderService);

  @observable private fleetOrderDrafts = new Map<string, FleetOrder[]>();
  timeout: NodeJS.Timeout;

  @computed get updatedOrdersCount() {
    return this.fleetOrderDrafts.size;
  }

  @computed private get lastWill() {
    const result: { [fleetId: string]: FleetOrder[] } = {};
    this.fleetOrderDrafts.forEach((value, key) => {
      result[key] = value;
    })
    return result;
  }

  constructor(
    private gameViewModel: GameViewModel,
    private gameData: GameData
  ) {

    reaction(
      () => this.gameViewModel.gameId,
      () => {
        this.fleetOrderDrafts.clear();
        this.defuseSaveTimeout()
      }
    )

    autorun(() => {
      this.orderService.setLastWillFleetOrders(this.gameViewModel.gameId!, this.lastWill)
    })

  }

  public async saveOrderDrafts() {
    for (const [fleetid, orderDrafts] of this.fleetOrderDrafts) {
      await this.orderService.updateFleetOrders(this.gameViewModel.gameId!, fleetid, orderDrafts);
    }
    this.fleetOrderDrafts.clear();
    this.defuseSaveTimeout()
  }

  public async clearOrderDrafts() {
    this.fleetOrderDrafts.clear();
    this.defuseSaveTimeout()
  }

  public addFleetOrder(fleetId: string, order: FleetOrder) {
    const currentOrders = this.fleetOrderDrafts.get(fleetId) || this.gameData.fleets[fleetId].orders;
    this.fleetOrderDrafts.set(fleetId, [...currentOrders, order]);
    this.activateSaveTimeout()
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
    this.activateSaveTimeout()
  }

  public updateFleetOrders(fleetId: string, orders: FleetOrder[]) {
    this.fleetOrderDrafts.set(fleetId, orders);
    this.activateSaveTimeout()
  }

  public clearFleetOrders(fleetId: string) {
    this.updateFleetOrders(fleetId, []);
  }

  private activateSaveTimeout() {
    this.defuseSaveTimeout();
    this.timeout = setTimeout(() => {
      this.saveOrderDrafts();
    }, 5 * 60 * 1000)
  }

  private defuseSaveTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}