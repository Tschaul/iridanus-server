import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const testMap: GameState = {
  players: {},
  currentTimestamp: 0,
  gameStartTimestamp: 0,
  gameEndTimestamp: 10000,
  universe: {
    fleets: {
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        id: "w1",
        population: 1,
        populationLimit: 2,
        ownerId: "p1",
      },
    },
    gates: {
    }
  }
}