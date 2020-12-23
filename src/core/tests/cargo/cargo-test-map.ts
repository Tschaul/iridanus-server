import { GameState } from "../../../shared/model/v1/state";
import { dummyReadyWorld } from '../test-helper';

export const cargoTestMap: GameState = {
  players: {
    p1: {
      playerId: "p1",
      status: 'PLAYING'
    },
    p2: {
      playerId: 'p2',
      status: 'PLAYING'
    }
  },
  currentTimestamp: 0,
  gameStartTimestamp: 0,
  gameEndTimestamp: 3000,
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
        lastDamageTimestamp: 0,
        idleNotificationSent: false
      }
    },
    worlds: {
      "w1": {
        ...dummyReadyWorld,
        id: "w1",
        population: { p1: 10 },
        ownerId: "p1",
        industry: 5,
        metal: 0,
      },
      "w2": {
        ...dummyReadyWorld,
        id: "w2",
        ownerId: "p1",
        population: { p1: 2 },
        metal: 10,
        industry: 0
      },
      "w3": {
        ...dummyReadyWorld,
        id: "w3",
        ownerId: "p1",
        population: { p1: 2 },
        metal: 10,
        industry: 0
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1","w3"],
      "w3": ["w2"]
    }
  }
}