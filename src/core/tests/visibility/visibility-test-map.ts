import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld, dummyLostWorld } from "../test-helper";

export const visibilityTestMap: GameState = {
  players: {
    p1: {
      influence: 0,
      lastScoringTimestamp: 0,
      playerId: "p1",
      score: 0
    }
  },
  currentTimestamp: 0,
  gameStartTimestamp: 0,
  gameEndTimestamp: 10000,
  universe: {
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
        ...dummyLostWorld,
        id: "w2",
      },
      "w3": {
        ...dummyLostWorld,
        id: "w3",
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1","w3"],
      "w3": ["w2"]
    }
  }
}