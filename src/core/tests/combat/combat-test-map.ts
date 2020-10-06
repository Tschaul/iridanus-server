import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from "../test-helper";

export const map: GameState = {
  players: {},
  currentTimestamp: 0,
  gameStartTimestamp: 0,
  gameEndTimestamp: 100000,
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
        integrity: 1,
      },
      "f2": {
        id: "f2",
        status: 'READY',
        combatStatus: 'AT_PEACE',
        currentWorldId: "w1",
        orders: [],
        ownerId: "p2",
        ships: 20,
        integrity: 1,
      }
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        population: 15,
        id: "w1",
        ownerId: "p1",
        integrity: 1,
      }
    },
    gates: {
    }
  }
}