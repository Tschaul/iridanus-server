import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const scoringTestMap: GameState = {
  currentTimestamp: 0,
  gameEndTimestamp: 999999999,
  scorings: {
    "p1": {
      influence: 0,
      lastScoringTimestamp: 0,
      playerId: "p1",
      score: 0
    },
    "p2": {
      influence: 0,
      lastScoringTimestamp: 0,
      playerId: "p1",
      score: 0
    },
  },
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
        status: 'READY',
        combatStatus: 'AT_PEACE',
        currentWorldId: "w2",
        metal: 0,
        orders: [],
        ownerId: "p2",
        ships: 10,
        population: 0,
        integrity: 1,
      },
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
        ownerId: "p2",
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1"],
    }
  }
}