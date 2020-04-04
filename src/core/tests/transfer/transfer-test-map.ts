import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const warpTestMap: GameState = {
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
        metal: 0,
        population: 0,
        orders: [],
        ownerId: "p1",
        ships: 10,
        integrity: 1,
      },
      "f2": {
        id: "f2",
        status: 'READY',
        combatStatus: 'AT_PEACE',
        currentWorldId: "w1",
        metal: 0,
        population: 0,
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
        industry: 5,
        metal: 10,
        ownerId: "p1",
        ships: 5,
      }
    },
    gates: {
    }
  }
}