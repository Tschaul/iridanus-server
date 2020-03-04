import { GameState } from "../../../shared/model/v1/state";

export const map: GameState = {
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
        metal: 0,
        orders: [],
        ownerId: "p2",
        ships: 10,
        integrity: 1,
      }
    },
    worlds: {
      "w1": {
        status: 'READY',
        id: "w1",
        industry: 5,
        metal: 40,
        mines: 1,
        ownerId: "p1",
        population: 25,
        ships: 5,
        orders: [],
        integrity: 1,
        combatStatus: 'AT_PEACE',
        miningStatus: 'NOT_MINING'
      }
    },
    gates: {
    }
  }
}