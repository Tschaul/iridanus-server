import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const caputerTestMap: GameState = {
  scorings: {},
  currentTimestamp: 0,
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
        metal: 0,
        orders: [],
        ownerId: "p1",
        ships: 10,
        population: 0,
        integrity: 1,
      },
      "f2": {
        id: "f2",
        status: 'LOST',
        currentWorldId: "w1",
        metal: 0,
        population: 0,
        orders: [],
        ships: 10,
        integrity: 1,
      }
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        id: "w1",
        ownerId: "p1",
        ships: 5,
      },
      "w2": {
        ...dummyReadyWorld,
        id: "w2",
        status: 'LOST'
      },
      "w3": {
        ...dummyReadyWorld,
        id: "w3",
        status: 'LOST'
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1", "w3"],
      "w3": ["w2"]
    }
  }
}