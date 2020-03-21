import { observable, computed, when } from "mobx";
import { IStreamListener, fromStream } from "mobx-utils";
import { GameInfo, GameMetaData } from "../../../shared/model/v1/game-info";
import { empty } from "rxjs";
import { GameState } from "../../../shared/model/v1/state";
import { PlayerInfos } from "../../../shared/model/v1/player-info";
import { GameViewModel } from "./game-view-model";
import { resolveFromRegistry } from "../../container-registry";
import { GameStateService } from "../../client/game-state/game-state.service";
import { FleetWithOwnerAtWorld, LostFleet, fleetIsAtWorld, WarpingFleet } from "../../../shared/model/v1/fleet";
import { VisibleState } from "../../../shared/model/v1/visible-state";

export type FleetByTwoWorlds = {
  [worldId1: string]: {
    [worldId2: string]: WarpingFleet[];
  };
};

const dummyState: VisibleState = {
  scorings: {},
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

export class GameData {

  private gameStateService = resolveFromRegistry(GameStateService);

  @observable private gameInfo: IStreamListener<GameInfo> = fromStream(empty(), dummyInfo);
  @observable private gameState: IStreamListener<VisibleState> = fromStream(empty(), dummyState);
  @observable private metaData: IStreamListener<GameMetaData> = fromStream(empty(), dummyMetaData);;

  @observable public doneLoading = false;

  @computed public get rawDrawingPositions() {
    const gameInfo = this.metaData.current as GameMetaData;
    return gameInfo.drawingPositions;
  }

  @computed public get playerInfos(): PlayerInfos {
    return this.gameInfo.current.players;
  };

  @computed private get universe() {
    return this.gameState.current.universe;
  }

  @computed public get scorings() {
    return this.gameState.current.scorings;
  }

  @computed public get worlds() {
    return this.gameState.current.universe.worlds;
  }

  @computed public get fleets() {
    return this.gameState.current.universe.fleets;
  }

  @computed public get gates() {
    return this.gameState.current.universe.gates;
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

  constructor(private gameViewModel: GameViewModel) {

  }

  focus() {
    const gameId = this.gameViewModel.gameId as string;
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
        this.doneLoading = true;
      }
    )
  }

  unfocus() {
    this.gameState.dispose();
    this.metaData.dispose();
    this.gameInfo.dispose();
  }
}