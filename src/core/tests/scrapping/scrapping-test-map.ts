import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const scrappingTestMap: GameState = {
  currentTimestamp: 0,
  gameEndTimestamp: Number.MAX_VALUE,
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
        ships: 5,
        integrity: 1,
      }
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        id: "w1",
        industry: 0,
        ownerId: "p1",
        ships: 20,
      }
    },
    gates: {
    }
  }
}