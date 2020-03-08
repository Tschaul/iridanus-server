import { Universe } from "../../../shared/model/v1/universe";
import { PlayerInfos } from "../../../shared/model/v1/player-info";
import { normalize } from "../../../shared/math/vec2";

export const mockUniverse: Universe = {
  visibility: {
    p1: {},
    p2: {}
  },
  fleets: {
    "f1": {
      id: "f1",
      status: 'READY',
      currentWorldId: "w1",
      metal: 0,
      orders: [{
        type: 'WARP',
        targetWorldId: 'w2'
      },{
        type: 'WARP',
        targetWorldId: 'w3'
      }],
      ownerId: "p2",
      ships: 10,
      integrity: 1,
      combatStatus: 'AT_PEACE'
    },
    "f2": {
      id: "f2",
      status: 'WARPING',
      originWorldId: "w1",
      targetWorldId: "w2",
      arrivingTimestamp: 0,
      metal: 0,
      orders: [],
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
      combatStatus: 'AT_PEACE',
      miningStatus: 'NOT_MINING',
      populationGrowthStatus: 'NOT_GROWING'
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
      combatStatus: 'AT_PEACE',
      miningStatus: 'NOT_MINING',
      populationGrowthStatus: 'NOT_GROWING'
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
      combatStatus: 'AT_PEACE',
      miningStatus: 'NOT_MINING',
      populationGrowthStatus: 'NOT_GROWING'
    }
  },
  gates: {
    "w1": ["w2"],
    "w2": ["w1", "w3"],
    "w3": ["w2"]
  }
}

export const mockPlayerInfos: PlayerInfos = {
  "p1": {
    id: 'p1',
    color: 'red',
    name: 'Paul',
    fleetDrawingPosition: normalize({ x: 1, y: -1 }),
    state: 'READY',
  },
  "p2": {
    id: 'p2',
    color: 'mediumseagreen',
    name: 'Peter',
    fleetDrawingPosition: normalize({ x: -1, y: -1 }),
    state: 'READY',
  },
  "p3": {
    id: 'p2',
    color: 'yellow',
    name: 'Franz',
    fleetDrawingPosition: normalize({ x: -1, y: 1 }),
    state: 'READY',
  }
};