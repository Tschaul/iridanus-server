import { GameState } from "../shared/model/v1/state";
import { WorldWithOwner } from "../shared/model/v1/world";

export const dummyReadyWorld: WorldWithOwner = {
  worldType: { type: 'REGULAR' },
  status: 'OWNED',
  id: "",
  industry: 0,
  metal: 0,
  mines: 0,
  ownerId: "",
  population: {},
  populationLimit: 25,
  miningStatus: { type: 'NOT_MINING' },
  combatStatus: { type: 'AT_PEACE' },
  populationGrowthStatus: { type: 'NOT_GROWING' },
  populationConversionStatus: { type: 'NOT_BEING_CAPTURED' },
  buildShipsStatus: { type: 'NOT_BUILDING_SHIPS' },
  worldDiscoveredNotificationSent: false
}

export const aiTestMap: GameState = {
  players: {},
  currentTimestamp: 0,
  gameStartTimestamp: 0,
  gameEndTimestamp: Number.MAX_SAFE_INTEGER,
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
        integrity: 1
      },
      "f2": {
        id: "f2",
        status: 'READY',
        combatStatus: 'AT_PEACE',
        currentWorldId: "w1",
        orders: [],
        ownerId: "p1",
        ships: 10,
        integrity: 1
      },
      "f3": {
        id: "f3",
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
        industry: 50,
        population: { p1: 25 }
      },
      "w2": {
        ...dummyReadyWorld,
        id: "w2",
        ownerId: "p1",
      },
      "w3": {
        ...dummyReadyWorld,
        id: "w3",
        ownerId: "p1",
        metal: 15
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1", "w3"],
      "w3": ["w2"]
    }
  }
}