import { Gates, Universe } from "../../shared/model/v1/universe";
import { makeHexCoordinates, getRank } from "./make-hex-coordinates";
import { Vec2 } from "../../shared/math/vec2";
import { LostWorld, ReadyWorld } from "../../shared/model/v1/world";
import { DrawingPositions } from "../../shared/model/v1/drawing-positions";
import { GameMap } from "../../shared/model/v1/game-map";
import { LostFleet } from "../../shared/model/v1/fleet";

const homeWorlds = ['c3', 'c7', 'c11'];

const seats: { [key: string]: string } = {
  c3: 'p1',
  c7: 'p2',
  c11: 'p3'
}

export function makeGomeisaThreeRandom(): GameMap {
  const worldPositions = makeHexCoordinates(4, 1);

  const universe: Universe = {
    fleets: {},
    worlds: {},
    gates,
    visibility: {}
  }


  const drawingPositions: DrawingPositions = {};

  Object.getOwnPropertyNames(worldPositions).forEach(worldId => {
    const [x, y] = worldPositions[worldId];
    const position: Vec2 = { x, y }
    drawingPositions[worldId] = position;

    if (homeWorlds.includes(worldId)) {
      universe.worlds[worldId] = {
        id: worldId,
        status: 'READY',
        ownerId: seats[worldId],
        combatStatus: 'AT_PEACE',
        miningStatus: 'NOT_MINING',
        populationGrowthStatus: 'NOT_GROWING',
        integrity: 0,
        metal: 0,
        mines: 2,
        orders: [],
        industry: 10,
        population: 30,
        populationLimit: 30,
        ships: 2,
        captureStatus: 'NOT_BEING_CAPTURED'
      };

      ([1, 2, 3]).forEach((index) => {
        const fleetId = 'w' + worldId + 'f' + index;
        universe.fleets[fleetId] = {
          status: 'READY',
          combatStatus: 'AT_PEACE',
          currentWorldId: worldId,
          id: fleetId,
          integrity: 0,
          metal: 0,
          population: 0,
          orders: [],
          ownerId: seats[worldId],
          ships: 6
        }
      })
    } else {
      let [world, fleets] = makeWorld(worldId);
      universe.worlds[worldId] = world;
      fleets.forEach(fleet => {
        universe.fleets[fleet.id] = fleet;
      })
    }

  })

  return {
    seats: Object.values(seats),
    universe,
    drawingPositions
  }
}

function makeWorld(id: string): [LostWorld, LostFleet[]] {

  let fleetKeyNumber = 1;

  // const rank = getRank(id);

  // const amount = 5 - rank;

  const random = randomSphericArray(4);


  const industry = Math.round(random[0] * 3);
  const mines = Math.round(random[1] * 6);
  const populationLimit = Math.max(Math.round(random[2] * 50), mines, industry)
  const population = Math.round(Math.random() * populationLimit);

  const world: LostWorld = {
    id,
    industry,
    integrity: 0,
    metal: 0,
    mines: mines,
    orders: [],
    population,
    populationLimit,
    ships: 0,
    status: 'LOST',
    captureStatus: 'NOT_BEING_CAPTURED'
  }

  const fleetAmount = Math.round(random[3])

  const fleets: LostFleet[] = Array.from(Array(fleetAmount).keys()).map(_ => {
    const fleetId = 'w' + id + 'f' + fleetKeyNumber++;
    return {
      status: 'LOST',
      currentWorldId: id,
      id: fleetId,
      integrity: 0,
      population: 0,
      metal: 0,
      orders: [],
      ships: 0
    }
  })

  return [world, fleets];
}

function randomSphericArray(length: number) {
  const equal = Array.from(Array(length).keys()).map(_ => Math.random());

  const squared = equal.reduce((acc, num) => {
    return acc += num * num;
  }, 0)

  return equal.map(num => num / Math.sqrt(squared));

}

export const gates: Gates = {
  a1: ['b2', 'b4', 'b6'],

  b1: ['b2', 'b6', 'c2', 'c1', 'c12'],
  b2: ['a1', 'b1', 'b3', 'c2', 'c3', 'c4'],
  b3: ['b2', 'b4', 'c4', 'c5', 'c6'],
  b4: ['a1', 'b3', 'b5', 'c6', 'c7', 'c8'],
  b5: ['b4', 'b6', 'c8', 'c9', 'c10'],
  b6: ['a1', 'b5', 'b1', 'c10', 'c11', 'c12'],

  c1: ['b1', 'd2', 'd18'],
  c2: ['b1', 'b2', 'd2', 'd3'],
  c3: ['b2', 'd3', 'd5'],
  c4: ['b2', 'b3', 'd5', 'd6'],
  c5: ['b3', 'd6', 'd8'],
  c6: ['b3', 'b4', 'd8', 'd9'],
  c7: ['b4', 'd9', 'd11'],
  c8: ['b4', 'b5', 'd11', 'd12'],
  c9: ['b5', 'd12', 'd14'],
  c10: ['b5', 'b6', 'd14', 'd15'],
  c11: ['b6', 'd15', 'd17'],
  c12: ['b6', 'b1', 'd17', 'd18'],

  d1: ['d18', 'd2'],
  d2: ['c1', 'c2', 'd1', 'd3'],
  d3: ['c2', 'c3', 'd2', 'd4'],
  d4: ['d3', 'd5'],
  d5: ['c3', 'c4', 'd4', 'd6'],
  d6: ['c4', 'c5', 'd5', 'd7'],
  d7: ['d6', 'd8'],
  d8: ['c5', 'c6', 'd7', 'd9'],
  d9: ['c6', 'c7', 'd8', 'd10'],
  d10: ['d9', 'd11'],
  d11: ['c7', 'c8', 'd10', 'd12'],
  d12: ['c8', 'c9', 'd11', 'd13'],
  d13: ['d12', 'd14'],
  d14: ['c9', 'c10', 'd13', 'd15'],
  d15: ['c10', 'c11', 'd14', 'd16'],
  d16: ['d15', 'd17'],
  d17: ['c11', 'c12', 'd16', 'd18'],
  d18: ['c12', 'c1', 'd17', 'd1'],

}