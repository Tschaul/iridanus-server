import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const miningTestMap: GameState = {
  currentTimestamp: 0,
  gameEndTimestamp: Number.MAX_VALUE,
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