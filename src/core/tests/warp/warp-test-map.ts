import { State } from "../../state";

export const warpTestMap: State = {
  currentTimestamp: 0,
  gameEndTimestamp: Number.MAX_VALUE,
  universe: {
    fleets: {
      "f1": {
        id: "f1",
        status: 'READY',
        currentWorldId: "w1",
        metal: 0,
        orders: [],
        ownerId: "p1",
        ships: 10
      }
    },
    worlds: {
      "w1": {
        id: "w1",
        industry: 5,
        metal: 40,
        mines: 1,
        ownerId: "p1",
        population: 25,
        ships: 5
      },
      "w2": {
        id: "w2",
        industry: 5,
        metal: 40,
        mines: 1,
        ownerId: "p1",
        population: 25,
        ships: 5
      },
      "w3": {
        id: "w3",
        industry: 5,
        metal: 40,
        mines: 1,
        ownerId: "p1",
        population: 25,
        ships: 5
      }
    },
    gates: {
      "w1": ["w2"],
      "w2": ["w1","w3"],
      "w3": ["w2"]
    }
  }
}