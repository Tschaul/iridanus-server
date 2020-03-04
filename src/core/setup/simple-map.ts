import { GameState } from "../../shared/model/v1/state";

export const simpleMap: GameState = {
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
        orders: [{
          type: 'WARP',
          targetWorldId: 'w2'
        }],
        ownerId: "p1",
        ships: 10,
        integrity: 1
      }
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
      "w2": {
        status: 'READY',
        orders: [],
        id: "w2",
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
      "w3": {
        status: 'READY',
        orders: [],
        id: "w3",
        industry: 5,
        metal: 40,
        mines: 1,
        ownerId: "p1",
        population: 25,
        ships: 5,
        integrity: 1,
        combatStatus: 'AT_PEACE',
        miningStatus: 'NOT_MINING'
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1","w3"],
      "w3": ["w2"]
    },
  }
}