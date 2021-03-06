import { GameViewModel } from "./game-view-model";
import { computed, observable } from "mobx";
import { WarpOrder, FleetOrder, StartCargoMissionOrder, SplitFleetOrder, DeployToWorldOrder, StopCargoMissionOrder } from "../../../shared/model/v1/fleet-orders";
import { GameOrders } from "./game-orders";
import { GameStageSelection } from "./stage-selection";
import { WorldHints } from "./world-hints";
import { visibleWorldhasOwner } from "../../../shared/model/v1/visible-state";
import { Fleet } from "../../../shared/model/v1/fleet";
import { GameData } from "./game-data";
import { findPathFromWorldToOneOfTwoWorlds, findPathFromWorldToWorld } from "../../../shared/math/path-finding/findPath";

export class OrderEditorViewModel {

  constructor(
    private gameViewModel: GameViewModel,
    private gameOrders: GameOrders,
    private selection: GameStageSelection,
    private worldHints: WorldHints,
    private gameData: GameData,
  ) {
  }

  @observable appendOrders = false;

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
    if (this.gameViewModel.isReplayMode) {
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
    return this.gameViewModel.isReplayMode
  }

  @computed get orders(): FleetOrder[] {

    switch (this.selectionType) {
      case 'FLEET':
        if (!this.selection.selectedFleetdId || !this.selection.selectedFleet) {
          return [];
        }
        return this.selection.selectedFleet.orders
      case 'WORLD':
        return [];
      default:
        return [];
    }
  }

  public updateOrder(order: FleetOrder, index: number) {
    if (this.selectionType === 'FLEET') {
      const newOrders = this.orders.slice(0) as FleetOrder[];
      newOrders[index] = order as FleetOrder;
      this.gameOrders.updateFleetOrders(this.selectedWorldOrFleetId as string, newOrders);
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
      if (!this.appendOrders) {
        this.gameOrders.clearFleetOrders(fleet.id);
      }
      if (
        (fleet.status === 'WAITING_FOR_CARGO' && fleet.currentWorldId === worldId)
        || (fleet.status === 'TRANSFERING_CARGO' && fleet.toWorldId === worldId)
      ) {
        const stopOrder: StopCargoMissionOrder = {
          type: 'STOP_CARGO_MISSION',
        };
        this.gameOrders.addFleetOrder(fleet.id, stopOrder);
        return;
      }
      const startWorld = this.projectedLastWorld(fleet);

      const path = findPathFromWorldToWorld(startWorld, worldId, this.gameData.gates, this.gameData.distances)

      this.addOrderForPath(path, fleet.id)

    }
  }

  public newStartCargoMissionOrder() {
    this.selection.requestGateTargetSelection('Select gate target!', (world1Id, world2Id) => {
      this.startCargoMissionBetweenWorlds(world1Id, world2Id);
    })
  }

  public startCargoMissionBetweenWorlds(world1Id: string, world2Id: string) {
    const fleet = this.selection.selectedFleet;
    if (fleet) {
      if (!this.appendOrders) {
        this.gameOrders.clearFleetOrders(fleet.id);
      }

      const startWorld = this.projectedLastWorld(fleet);

      const path = findPathFromWorldToOneOfTwoWorlds(startWorld, [world1Id, world2Id], this.gameData.gates, this.gameData.distances)

      this.addOrderForPath(path, fleet.id)

      const lastWorldId = path.length ? path[path.length - 1][1] : startWorld

      const otherWorldId = lastWorldId === world1Id ? world2Id : world1Id;

      const routePath = findPathFromWorldToWorld(lastWorldId, otherWorldId, this.gameData.gates, this.gameData.distances)

      const route = routePath.map(it => it[0]).concat(routePath.slice(-1).map(it => it[1]))

      const warpOrder: StartCargoMissionOrder = {
        type: 'START_CARGO_MISSION',
        cargoRoute: route
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

  private setOrAppendFleetOrder(fleetId: string, order: FleetOrder) {
    if (!this.appendOrders) {
      this.gameOrders.clearFleetOrders(fleetId);
    }
    this.gameOrders.addFleetOrder(fleetId, order)
  }

  public newSplitFleetOrder() {
    const fleet = this.selection.selectedFleet!;
    const order: SplitFleetOrder = {
      type: 'SPLIT_FLEET',
    }
    this.setOrAppendFleetOrder(fleet.id, order);
  }

  public newDeployToWorldOrder() {
    const fleet = this.selection.selectedFleet!;
    const worldId = this.projectedLastWorld(fleet);
    const order: DeployToWorldOrder = {
      type: 'DEPLOY_TO_WORLD',
      worldId
    }
    this.setOrAppendFleetOrder(fleet.id, order);
  }

  worldsWithHints: string[];

  public showHintsForOrder(order: FleetOrder) {
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
    this.clearHints();
  }

  private projectedLastWorld(fleet: Fleet) {

    const lastWarpOrder = fleet.orders.slice(0).reverse().find(order => order.type === 'WARP') as WarpOrder | null;

    if (lastWarpOrder && this.appendOrders) {
      return lastWarpOrder.targetWorldId
    }

    if (fleet.status === 'WARPING' || fleet.status === 'LEAVING') {
      return fleet.targetWorldId
    }

    if (fleet.status === 'TRANSFERING_CARGO') {
      return fleet.toWorldId
    }

    if (fleet.status === 'WAITING_FOR_CARGO') {
      return fleet.currentWorldId
    }

    return fleet.currentWorldId;

  }

}