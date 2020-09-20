import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const captureTestMap: GameState = {
  scorings: {},
  currentTimestamp: 0,
  gameStartTimestamp: 0,
  gameEndTimestamp: 10000,
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
        integrity: 1,
      }
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        id: "w1",
        ownerId: "p2",
      },
      "w2": {
        ...dummyReadyWorld,
        id: "w2",
        ownerId: "p2",
      },
      "w3": {
        ...dummyReadyWorld,
        id: "w3",
        ownerId: "p2",
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1", "w3"],
      "w3": ["w2"]
    }
  }
}