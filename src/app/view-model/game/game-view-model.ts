import { observable, computed, when, reaction } from "mobx";
import { Universe } from "../../../shared/model/v1/universe";
import { DrawingPositions } from "../../../shared/model/v1/drawing-positions";
import { MainViewModel } from "../main-view-model";
import { GameStageViewModel } from "./game-stage-view-model";
import { PlayerInfos } from "../../../shared/model/v1/player-info";
import { fleetIsAtWorld, FleetWithOwnerAtWorld, LostFleet, WarpingFleet } from "../../../shared/model/v1/fleet";
import { mockPlayerInfos } from "./mock-data";
import { SelectedWorldViewModel } from "./selected-world-view-model";
import { OrderEditorViewModel } from "./order-editor-view-model";
import { resolveFromRegistry } from "../../container-registry";
import { GameStateService } from "../../client/game-state/game-state.service";
import { IStreamListener, fromStream } from "mobx-utils";
import { empty } from "rxjs";
import { GameInfo, StartedGameInfo, GameMetaData } from "../../../shared/model/v1/game-info";
import { GameState } from "../../../shared/model/v1/state";
import { OrderService } from "../../client/orders/order-service";
import { FleetOrder } from "../../../shared/model/v1/fleet-orders";
import { WorldOrder } from "../../../shared/model/v1/world-order";

export type StageSelection = {
  type: 'WORLD',
  id: string
} | {
  type: 'GATE',
  id1: string,
  id2: string
} | {
  type: 'NONE'
}

export type FleetByTwoWorlds = {
  [worldId1: string]: {
    [worldId2: string]: WarpingFleet[];
  };
};

const dummyState: GameState = {
  currentTimestamp: 0,
  gameEndTimestamp: Number.MAX_SAFE_INTEGER,
  universe: {
    fleets: {},
    worlds: {},
    gates: {}
  }
}

const dummyMetaData: GameMetaData = {
  drawingPositions: {}
}

const dummyInfo: GameInfo = {
  id: '',
  state: 'STARTED',
  players: {}
}

export class GameViewModel {

  private gameStateService = resolveFromRegistry(GameStateService);
  private orderService = resolveFromRegistry(OrderService)
  gameStageViewModel = new GameStageViewModel(this);
  selectedWorldViewModel = new SelectedWorldViewModel(this);
  orderEditorViewModel = new OrderEditorViewModel(this);

  @observable private fleetOrderDrafts = new Map<string, FleetOrder[]>();
  @observable private worldOrderDrafts = new Map<string, WorldOrder[]>();

  @computed get updatedOrdersCount() {
    return this.fleetOrderDrafts.size + this.worldOrderDrafts.size;
  }

  @observable public gameInfo: IStreamListener<GameInfo> = fromStream(empty(), dummyInfo);

  @observable public gameState: IStreamListener<GameState> = fromStream(empty(), dummyState);
  @observable public metaData: IStreamListener<GameMetaData> = fromStream(empty(), dummyMetaData);;

  @observable public doneLoading = false;

  @computed public get rawDrawingPositions() {
    const gameInfo = this.metaData.current as GameMetaData;
    return gameInfo.drawingPositions;
  }

  @computed public get gameId() {
    return this.mainViewModel.activeGameId;
  }

  @computed public get playerInfos(): PlayerInfos {
    return this.gameInfo.current.players;
  };

  @computed public get universe(): Universe {

    return this.gameState.current.universe;
  }

  constructor(private mainViewModel: MainViewModel) {
    reaction(
      () => this.gameId,
      () => {
        this.fleetOrderDrafts.clear();
        this.worldOrderDrafts.clear();
      }
    )
  }

  public focus() {
    const gameId = this.mainViewModel.activeGameId as string;
    this.gameInfo = fromStream(this.gameStateService.getGameInfoById(gameId), dummyInfo);
    this.metaData = fromStream(this.gameStateService.getGameMetaDataById(gameId), dummyMetaData);
    when(
      () => !!Object.values(this.metaData.current.drawingPositions).length,
      () => {
        this.gameState = fromStream(this.gameStateService.getGameStateById(gameId), dummyState);
      }
    )
    when(
      () => !!Object.values(this.gameState.current.universe.worlds),
      () => {
        console.log("doneLoading")
        this.doneLoading = true;
      }
    )
  }

  public unfocus() {
    this.gameState.dispose();
    this.gameInfo.dispose();
  }

  @computed public get selectedWorld() {
    if (this.stageSelection.type === 'WORLD') {
      const world = this.universe.worlds[this.stageSelection.id];
      const orderDrafts = this.worldOrderDrafts.get(this.stageSelection.id);
      if (orderDrafts) {
        return {
          ...world,
          orders: orderDrafts
        }
      } else {
        return world
      }
    } else {
      return null;
    }
  }

  @computed get selectedFleet() {
    if (this.selectedFleetdId) {
      const fleet = this.universe.fleets[this.selectedFleetdId];
      const orderDrafts = this.fleetOrderDrafts.get(this.selectedFleetdId);
      if (orderDrafts) {
        return {
          ...fleet,
          orders: orderDrafts
        }
      } else {
        return fleet
      }
    } else {
      return null;
    }
  }

  @computed get fleetsByWorldId() {
    const result: { [k: string]: Array<FleetWithOwnerAtWorld | LostFleet> } = {};
    for (const fleetKey of Object.getOwnPropertyNames(this.universe.fleets)) {
      const fleet = this.universe.fleets[fleetKey];
      if (fleetIsAtWorld(fleet)) {
        result[fleet.currentWorldId] = result[fleet.currentWorldId] || [];
        result[fleet.currentWorldId].push(fleet)
      }
    }
    return result;
  }

  @computed get warpingFleetsByBothWorlds() {
    const fleets = Object.values(this.universe.fleets).filter(
      fleet => !fleetIsAtWorld(fleet)
    ) as WarpingFleet[];

    const result: FleetByTwoWorlds = {};

    for (const fleet of fleets) {
      const [id1, id2] = [fleet.originWorldId, fleet.targetWorldId].sort();
      result[id1] = result[id1] || {};
      result[id1][id2] = result[id1][id2] || [];
      result[id1][id2].push(fleet);
    }

    return result;
  }

  @observable public stageSelection: StageSelection = { type: 'NONE' };

  @observable public selectedFleetdId: string | null = null;

  @computed public get selfPlayerId(): string {
    if (!this.mainViewModel.loggedInUserId) {
      throw new Error('User is not logged in.');
    }
    return this.mainViewModel.loggedInUserId;
  }

  backToLobby() {
    this.mainViewModel.activeGameId = null;
  }


  requestWorldTargetSelection(description: string, callback: (worldId: string) => void) {
    this.gameStageViewModel.requestWorldTargetSelection(description, callback);
  }


  public async saveOrderDrafts() {
    for (const [worldId, orderDrafts] of this.worldOrderDrafts) {
      await this.orderService.updateWorldOrders(this.gameId!, worldId, orderDrafts);
    }
    this.worldOrderDrafts.clear()
    for (const [fleetid, orderDrafts] of this.fleetOrderDrafts) {
      await this.orderService.updateFleetOrders(this.gameId!, fleetid, orderDrafts);
    }
    this.fleetOrderDrafts.clear()
  }

  addFleetOrder(fleetId: string, order: FleetOrder) {
    const currentOrders = this.fleetOrderDrafts.get(fleetId) || this.universe.fleets[fleetId].orders;
    this.fleetOrderDrafts.set(fleetId, [...currentOrders, order]);
  }
}