import {observable, computed} from "mobx";
import { Universe } from "../../../shared/model/universe";
import { DrawingPositions } from "../../../shared/model/drawing-positions";
import { MainViewModel } from "../main-view-model";
import { GameStageViewModel } from "./game-stage-view-model";

export class GameViewModel {

  gameStageViewModel = new GameStageViewModel(this);

  constructor(private mainViewModel: MainViewModel) {}

  @observable public rawDrawingPositions: DrawingPositions = {
    "w1": {x: 0, y: 0},
    "w2": {x: 0.5, y: 0.5},
    "w3": {x: 1, y: 1},
  }

  @observable public universe: Universe = {
      fleets: {
        "f1": {
          id: "f1",
          status: 'READY',
          combatStatus: 'AT_PEACE',
          currentWorldId: "w1",
          metal: 0,
          orders: [{
            type: 'WARP',
            targetWorldId: 'w2'
          }],
          ownerId: "p1",
          ships: 10,
          integrity: 1
        }
      },
      worlds: {
        "w1": {
          status: 'READY',
          orders: [],
          id: "w1",
          industry: 5,
          metal: 40,
          mines: 1,
          ownerId: "p1",
          population: 25,
          ships: 5,
          integrity: 1,
          combatStatus: 'AT_PEACE'
        },
        "w2": {
          status: 'READY',
          orders: [],
          id: "w2",
          industry: 5,
          metal: 40,
          mines: 1,
          ownerId: "p1",
          population: 25,
          ships: 5,
          integrity: 1,
          combatStatus: 'AT_PEACE'
        },
        "w3": {
          status: 'READY',
          orders: [],
          id: "w3",
          industry: 5,
          metal: 40,
          mines: 1,
          ownerId: "p1",
          population: 25,
          ships: 5,
          integrity: 1,
          combatStatus: 'AT_PEACE'
        }
      },
      gates: {
        "w1": ["w2"],
        "w2": ["w1","w3"],
        "w3": ["w2"]
      }
  }
}