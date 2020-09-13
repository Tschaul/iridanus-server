import { GameState } from "../shared/model/v1/state";
import { ReadyWorld } from "../shared/model/v1/world";

export const dummyReadyWorld: ReadyWorld = {
  status: 'READY',
  id: "",
  industry: 0,
  metal: 10,
  mines: 0,
  ownerId: "",
  population: 25,
  populationLimit: 25,
  integrity: 1,
  miningStatus: 'NOT_MINING',
  populationGrowthStatus: 'NOT_GROWING',
  captureStatus: 'NOT_BEING_CAPTURED'
}

export const aiTestMap: GameState = {
  scorings: {},
  currentTimestamp: 0,
  gameStartTimestamp: 0,
  gameEndTimestamp: Number.MAX_SAFE_INTEGER,
  universe: {
    visibility: {
      p1: {},
      p2: {}
    },
    fleets: {
      "f1": {
        id: "f1",
        status: 'READY',
        combatStatus: 'AT_PEACE',
        currentWorldId: "w1",
        orders: [],
        ownerId: "p1",
        ships: 10,
        integrity: 1
      }
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        id: "w1",
        ownerId: "p1",
      },
      "w2": {
        ...dummyReadyWorld,
        id: "w2",
        ownerId: "p1",
      },
      "w3": {
        ...dummyReadyWorld,
        id: "w3",
        ownerId: "p1",
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1", "w3"],
      "w3": ["w2"]
    }
  }
}