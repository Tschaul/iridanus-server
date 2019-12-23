import {observable, computed} from "mobx";
import { Universe } from "../../../shared/model/universe";
import { DrawingPositions } from "../../../shared/model/drawing-positions";
import { MainViewModel } from "../main-view-model";
import { GameStageViewModel } from "./game-stage-view-model";
import { PlayerInfos } from "../../../shared/model/player-info";
import { fleetIsAtWorld, FleetWithOwnerAtWorld, LostFleet } from "../../../shared/model/fleet";
import { mockUniverse, mockPlayerInfos, mockRawDrawingPositions } from "./mock-data";
import { SelectedWorldViewModel } from "./selected-world-view-model";
import { OrderEditorViewModel } from "./order-editor-view-model";

export class GameViewModel {

  gameStageViewModel = new GameStageViewModel(this);
  selectedWorldViewModel = new SelectedWorldViewModel(this);
  orderEditorViewModel = new OrderEditorViewModel(this);

  constructor(private mainViewModel: MainViewModel) {}

  @computed public get selectedWorld() {
    const id = this.selectedWorldId;
    if (id) {
      return this.universe.worlds[id];
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

  @observable public selectedWorldId: string | null = null;

  @observable public selectedFleetdId: string | null = null;

  @observable public selfPlayerId: string = 'p1';

  @observable public rawDrawingPositions: DrawingPositions = mockRawDrawingPositions;

  @observable public playerInfos: PlayerInfos = mockPlayerInfos;

  @observable public universe: Universe = mockUniverse;
}