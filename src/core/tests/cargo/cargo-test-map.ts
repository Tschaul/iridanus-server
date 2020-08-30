import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from '../test-helper';

export const cargoTestMap: GameState = {
  scorings: {
    p1: {
      influence: 0,
      lastScoringTimestamp: 0,
      playerId: 'p1',
      score: 0
    },
    p2: {
      influence: 0,
      lastScoringTimestamp: 0,
      playerId: 'p2',
      score: 0
    }
  },
  currentTimestamp: 0,
  gameStartTimestamp: 0,
  gameEndTimestamp: 3000,
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
        industry: 10,
        metal: 0,
      },
      "w2": {
        ...dummyReadyWorld,
        id: "w2",
        ownerId: "p1",
        population: 5,
        metal: 10,
        industry: 0
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1",]
    }
  }
}