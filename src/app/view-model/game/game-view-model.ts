import { observable, computed, when } from "mobx";
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

  gameStageViewModel = new GameStageViewModel(this);
  selectedWorldViewModel = new SelectedWorldViewModel(this);
  orderEditorViewModel = new OrderEditorViewModel(this);

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

  constructor(private mainViewModel: MainViewModel) { }

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
      return this.universe.worlds[this.stageSelection.id];
    } else {
      return null;
    }
  }

  @computed get selectedFleet() {
    if (this.selectedFleetdId) {
      return this.universe.fleets[this.selectedFleetdId];
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
}