import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const buildTestMap: GameState = {
  scorings: {},
  currentTimestamp: 0,
  gameEndTimestamp: Number.MAX_SAFE_INTEGER,
  universe: {
    visibility: {
      p1: {},
      p2: {}
    },
    fleets: {
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        id: "w1",
        industry: 5,
        ships: 0,
        metal: 40,
        ownerId: "p1",
        population: 25,
      },
    },
    gates: {
    }
  }
}