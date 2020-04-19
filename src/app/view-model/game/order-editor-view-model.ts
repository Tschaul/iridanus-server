import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";
import { WarpOrder, FleetOrder, LoadMetalOrder, LoadShipsOrder, DropShipsOrder, DropMetalOrder, LoadPopulationOrder, DropPopulationOrder, AwaitCaptureOrder } from "../../../shared/model/v1/fleet-orders";
import { WorldOrder, BuildIndustryOrder, BuildShipsOrder, ScrapShipsForIndustryOrder } from "../../../shared/model/v1/world-order";
import { GameOrders } from "./game-orders";
import { GameStageSelection } from "./stage-selection";
import { WorldHints } from "./world-hints";
import { visibleWorldIsWorld, visibleWorldhasOwner } from "../../../shared/model/v1/visible-state";
import { fleetHasOwner, Fleet } from "../../../shared/model/v1/fleet";
import { GameData } from "./game-data";

export class OrderEditorViewModel {

  constructor(
    private gameViewModel: GameViewModel,
    private gameOrders: GameOrders,
    private selection: GameStageSelection,
    private worldHints: WorldHints,
    private gameData: GameData,
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

  @computed get selectedWorldOrFleetIsVisibleToUser() {
    if (this.gameViewModel.selfIsSpecator) {
      return true;
    }
    if (this.selection.selectedFleet) {
      const fleet = this.selection.selectedFleet;
      return fleetHasOwner(fleet) && fleet.ownerId === this.gameViewModel.selfPlayerId;
    } else if (this.selection.selectedWorld) {
      const world = this.selection.selectedWorld;
      return visibleWorldhasOwner(world) && world.ownerId === this.gameViewModel.selfPlayerId;
    } else {
      return true
    }
  }

  @computed get selfIsSpectator(): boolean {
    return this.gameViewModel.selfIsSpecator
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
        if (visibleWorldIsWorld(this.selection.selectedWorld!)) {
          return this.selection.selectedWorld!.orders;
        }
        return [];
      default:
        return [];
    }
  }

  public updateOrder(order: FleetOrder | WorldOrder, index: number) {
    if (this.selectionType === 'FLEET') {
      const newOrders = this.orders.slice(0) as FleetOrder[];
      newOrders[index] = order as FleetOrder;
      this.gameOrders.updateFleetOrders(this.selectedWorldOrFleetId as string, newOrders);
    } else {
      const newOrders = this.orders.slice(0) as WorldOrder[];
      newOrders[index] = order as WorldOrder;
      this.gameOrders.updateWorldOrders(this.selectedWorldOrFleetId as string, newOrders);

    }
  }

  public newWarpOrder() {
    this.selection.requestWorldTargetSelection('Select warp target!', (worldId) => {

      const fleet = this.selection.selectedFleet!;

      const lastWorldId = this.projectedLastWorld(fleet);

      if (this.gameData.gates[lastWorldId].includes(worldId)) {

        const warpOrder: WarpOrder = {
          type: 'WARP',
          targetWorldId: worldId
        }
  
        this.gameOrders.addFleetOrder(fleet.id, warpOrder);
      }
    })
  }

  public newAwaitCaptureOrder() {
    const fleet = this.selection.selectedFleet!;
    const order: AwaitCaptureOrder = {
      type: 'AWAIT_CAPTURE',
    }
    this.gameOrders.addFleetOrder(fleet.id, order);
  }

  public newLoadPopulationOrder(amount: number) {
    const fleet = this.selection.selectedFleet!;
    const order: LoadPopulationOrder = {
      type: 'LOAD_POPULATION',
      amount
    }
    this.gameOrders.addFleetOrder(fleet.id, order);
  }

  public newLoadMetalOrder(amount: number) {
      const fleet = this.selection.selectedFleet!;
      const order: LoadMetalOrder = {
        type: 'LOAD_METAL',
        amount
      }
      this.gameOrders.addFleetOrder(fleet.id, order);
  }

  public newLoadShipsOrder(amount: number) {
      const fleet = this.selection.selectedFleet!;
      const order: LoadShipsOrder = {
        type: 'LOAD_SHIPS',
        amount
      }
      this.gameOrders.addFleetOrder(fleet.id, order);
  }

  public newDropPopulationOrder(amount: number) {
      const fleet = this.selection.selectedFleet!;
      const order: DropPopulationOrder = {
        type: 'DROP_POPULATION',
        amount
      }
      this.gameOrders.addFleetOrder(fleet.id, order);
  }

  public newDropMetalOrder(amount: number) {
      const fleet = this.selection.selectedFleet!;
      const order: DropMetalOrder = {
        type: 'DROP_METAL',
        amount
      }
      this.gameOrders.addFleetOrder(fleet.id, order);
  }

  public newDropShipsOrder(amount: number) {
      const fleet = this.selection.selectedFleet!;
      const order: DropShipsOrder = {
        type: 'DROP_SHIPS',
        amount
      }
      this.gameOrders.addFleetOrder(fleet.id, order);
  }

  public newScrapShipsOrder(amount: number) {      
    const world = this.selection.selectedWorld!;
    const order: ScrapShipsForIndustryOrder = {
      type: 'SCRAP_SHIPS_FOR_INDUSTRY',
      amount
    }
    this.gameOrders.addWorldOrder(world.id, order);
  }

  public newBuildIndustryOrder(amount: number) {
    const world = this.selection.selectedWorld!;
    const order: BuildIndustryOrder = {
      type: 'BUILD_INDUSTRY',
      amount
    }
    this.gameOrders.addWorldOrder(world.id, order);
  }
  
  public newBuildShipsOrder(amount: number) {
    const world = this.selection.selectedWorld!;
    const order: BuildShipsOrder = {
      type: 'BUILD_SHIPS',
      amount
    }
    this.gameOrders.addWorldOrder(world.id, order);
  }

  worldsWithHints: string[];

  public showHintsForOrder(order: FleetOrder | WorldOrder) {
    switch (order.type) {
      case 'WARP':
        this.worldHints.showHints([{ type: 'WORLD', worldId: order.targetWorldId, hint: 'Target world' }]);
        return;
      default:
        this.worldHints.clearHints();
        return;
    }
  }

  public clearHints() {
    this.worldHints.clearHints();
  }

  public deleteOrder(index: number) {
    if (this.selectionType === 'FLEET') {
      this.gameOrders.deleteFleetOrder(this.selectedWorldOrFleetId as string, index)
    }
    if (this.selectionType === 'WORLD') {
      this.gameOrders.deleteWorldOrder(this.selectedWorldOrFleetId as string, index)
    }
    this.clearHints();
  }

  private projectedLastWorld(fleet: Fleet) {

    const lastWarpOrder = fleet.orders.slice(0).reverse().find(order => order.type === 'WARP') as WarpOrder | null;

    if (lastWarpOrder) {
      return lastWarpOrder.targetWorldId
    }

    if (fleet.status === 'WARPING') {
      return fleet.targetWorldId
    }

    return fleet.currentWorldId;
    
  }

}