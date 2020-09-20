import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const miningTestMap: GameState = {
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
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        id: "w1",
        metal: 2,
        mines: 3,
        ownerId: "p1",
      },
    },
    gates: {
    }
  }
}