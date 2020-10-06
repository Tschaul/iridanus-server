import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const buildTestMap: GameState = {
  players: {},
  currentTimestamp: 0,
  gameStartTimestamp: 0,
  gameEndTimestamp: 100000,
  universe: {
    fleets: {
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        id: "w1",
        industry: 5,
        metal: 5,
        ownerId: "p1",
        population: 25,
      },
    },
    gates: {
    }
  }
}