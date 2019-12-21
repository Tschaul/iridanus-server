import {observable, computed} from "mobx";
import { Universe } from "../../../shared/model/universe";
import { DrawingPositions } from "../../../shared/model/drawing-positions";
import { MainViewModel } from "../main-view-model";
import { GameStageViewModel } from "./game-stage-view-model";
import { PlayerInfos } from "../../../shared/model/player-info";
import { fleetIsAtWorld, FleetWithOwnerAtWorld, LostFleet } from "../../../shared/model/fleet";
import { mockUniverse, mockPlayerInfos, mockRawDrawingPositions } from "./mock-data";
import { SelectedWorldViewModel } from "./selected-world-view-model";

export class GameViewModel {

  gameStageViewModel = new GameStageViewModel(this);
  selectedWorldViewModel = new SelectedWorldViewModel(this);

  constructor(private mainViewModel: MainViewModel) {}

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

  @observable public selectedWorldId: string | null = null;

  @observable public selectedFleetdId: string | null = null;

  @observable public selfPlayerId: string = 'p1';

  @observable public rawDrawingPositions: DrawingPositions = mockRawDrawingPositions;

  @observable public playerInfos: PlayerInfos = mockPlayerInfos;

  @observable public universe: Universe = mockUniverse;
}