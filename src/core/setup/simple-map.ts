import { GameState } from "../../shared/model/v1/state";

export const simpleMap: GameState = {
  currentTimestamp: 0,
  gameEndTimestamp: Number.MAX_VALUE,
  universe: {
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
        combatStatus: 'AT_PEACE'
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
        combatStatus: 'AT_PEACE'
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
        combatStatus: 'AT_PEACE'
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1","w3"],
      "w3": ["w2"]
    },
    drawingPositions: {
      "w1": { x: 0, y: 0 },
      "w2": { x: 0.125, y: 0.125 },
      "w3": { x: 0.25, y: 0.25 },
    }
  }
}