import { GameState } from "../../../shared/model/v1/state";

export const buildTestMap: GameState = {
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
        status: 'READY',
        orders: [],
        id: "w1",
        industry: 5,
        metal: 40,
        mines: 1,
        ownerId: "p1",
        population: 25,
        ships: 5,
        integrity: 1,
        combatStatus: 'AT_PEACE',
        miningStatus: 'NOT_MINING'
      },
    },
    gates: {
    }
  }
}