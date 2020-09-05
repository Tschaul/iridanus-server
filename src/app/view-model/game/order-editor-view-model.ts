import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";
import { WarpOrder, FleetOrder, AwaitCaptureOrder, StartCargoMissionOrder } from "../../../shared/model/v1/fleet-orders";
import { WorldOrder, BuildIndustryOrder, BuildShipsOrder, ScrapShipsForIndustryOrder } from "../../../shared/model/v1/world-order";
import { GameOrders } from "./game-orders";
import { GameStageSelection } from "./stage-selection";
import { WorldHints } from "./world-hints";
import { visibleWorldIsWorld, visibleWorldhasOwner } from "../../../shared/model/v1/visible-state";
import { Fleet } from "../../../shared/model/v1/fleet";
import { GameData } from "./game-data";
import { findPathFromWorldToGate, findPathFromWorldToWorld } from "../../../shared/math/path-finding/findPath";

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
      return fleet.ownerId === this.gameViewModel.selfPlayerId;
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

      this.newWarpOrderToWorld(worldId);
    })
  }

  public newWarpOrderToWorld(worldId: string) {
    const fleet = this.selection.selectedFleet;
    if (fleet) {

      const startWorld = this.projectedLastWorld(fleet);

      const path = findPathFromWorldToWorld(startWorld, worldId, this.gameData.gates, this.gameData.distances)

      this.addOrderForPath(path, fleet.id)

    }
  }

  public newStartCargoMissionOrder() {
    this.selection.requestGateTargetSelection('Select gate target!', (world1Id, world2Id) => {
      this.startCargoMissionAtGate(world1Id, world2Id);
    })
  }

  public startCargoMissionAtGate(world1Id: string, world2Id: string) {
    const fleet = this.selection.selectedFleet;
    if (fleet) {

      const startWorld = this.projectedLastWorld(fleet);

      const path = findPathFromWorldToGate(startWorld, [world1Id, world2Id], this.gameData.gates, this.gameData.distances)

      this.addOrderForPath(path, fleet.id)

      const lastWorldId = path.length ? path[path.length - 1][1] : startWorld

      const otherWorldId = lastWorldId === world1Id ? world2Id : world1Id;

      const warpOrder: StartCargoMissionOrder = {
        type: 'START_CARGO_MISSION',
        otherWorldId: otherWorldId
      };

      this.gameOrders.addFleetOrder(fleet.id, warpOrder);
    }
  }

  private addOrderForPath(path: Array<[string, string]>, fleetId: string) {

    for (const item of path) {
      const warpOrder: WarpOrder = {
        type: 'WARP',
        targetWorldId: item[1]
      };

      this.gameOrders.addFleetOrder(fleetId, warpOrder);
    }

  }

  public newAwaitCaptureOrder() {
    const fleet = this.selection.selectedFleet!;
    const order: AwaitCaptureOrder = {
      type: 'AWAIT_CAPTURE',
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

    if (fleet.status === 'TRANSFERING_CARGO') {
      return fleet.toWorldId
    }

    if (fleet.status === 'WAITING_FOR_CARGO') {
      return fleet.fromWorldId
    }

    return fleet.currentWorldId;

  }

}