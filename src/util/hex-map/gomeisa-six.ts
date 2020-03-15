import { Gates, Universe } from "../../shared/model/v1/universe";
import { makeHexCoordinates } from "./make-hex-coordinates";
import { Vec2 } from "../../shared/math/vec2";
import { LostWorld } from "../../shared/model/v1/world";
import { DrawingPositions } from "../../shared/model/v1/drawing-positions";
import { GameMap } from "../../shared/model/v1/game-map";

export function makeGomeisaSix(): GameMap {
  const worldPositions = makeHexCoordinates(5, 1);

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
    universe.worlds[worldId] = makeWorld(worldId);
    drawingPositions[worldId] = position;
  })

  return {
    universe,
    drawingPositions,
    seats: []
  }
}

function makeWorld(id: string): LostWorld {
  return {
    id,
    industry: 0,
    integrity: 0,
    metal: 0,
    mines: 0,
    orders: [],
    population: 0,
    populationLimit: 0,
    ships: 1,
    status: 'LOST',
    captureStatus: 'NOT_BEING_CAPTURED'
  }
}

export const gates: Gates = {
  a1: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'],

  b1: ['a1', 'b2', 'b6', 'c2', 'c1', 'c12'],
  b2: ['a1', 'b1', 'b3', 'c2', 'c3', 'c4'],
  b3: ['a1', 'b2', 'b4', 'c4', 'c5', 'c6'],
  b4: ['a1', 'b3', 'b5', 'c6', 'c7', 'c8'],
  b5: ['a1', 'b4', 'b6', 'c8', 'c9', 'c10'],
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

  d1: ['d18', 'd2', 'e24', 'e2'],
  d2: ['c1', 'c2', 'd1', 'e3'],
  d3: ['c2', 'c3', 'd4', 'e3'],
  d4: ['d3', 'd5', 'e4', 'e6'],
  d5: ['c3', 'c4', 'd4', 'e7'],
  d6: ['c4', 'c5', 'd7', 'e7'],
  d7: ['d6', 'd8', 'e8', 'e10'],
  d8: ['c5', 'c6', 'd7', 'e11'],
  d9: ['c6', 'c7', 'd10', 'e11'],
  d10: ['d9', 'd11', 'e12', 'e14'],
  d11: ['c7', 'c8', 'd10', 'e15'],
  d12: ['c8', 'c9', 'd13', 'e15'],
  d13: ['d12', 'd14', 'e16', 'e18'],
  d14: ['c9', 'c10', 'd13', 'e19'],
  d15: ['c10', 'c11', 'd16', 'e19'],
  d16: ['d15', 'd17', 'e20', 'e22'],
  d17: ['c11', 'c12', 'd16', 'e23'],
  d18: ['c12', 'c1', 'd1', 'e23'],

  e1: ['e2', 'e24'],
  e2: ['d1', 'e1', 'e3'],
  e3: ['d2', 'd3', 'e2', 'e4'],
  e4: ['d4', 'e3', 'e5'],
  e5: ['e4', 'e6'],
  e6: ['d4', 'e5', 'e7'],
  e7: ['d5', 'd6', 'e6', 'e8'],
  e8: ['d7', 'e7', 'e9'],
  e9: ['e8', 'e10'],
  e10: ['d7', 'e9', 'e11'],
  e11: ['d8', 'd9', 'e10', 'e12'],
  e12: ['d10', 'e11', 'e13'],
  e13: ['e12', 'e14'],
  e14: ['d10', 'e13', 'e15'],
  e15: ['d11', 'd12', 'e14', 'e16'],
  e16: ['d13', 'e15', 'e17'],
  e17: ['e16', 'e18'],
  e18: ['d13', 'e17', 'e19'],
  e19: ['d14', 'd15', 'e18', 'e20'],
  e20: ['d16', 'e19', 'e21'],
  e21: ['e20', 'e22'],
  e22: ['d16', 'e21', 'e23'],
  e23: ['d17', 'd18', 'e22', 'e24'],
  e24: ['d1', 'e23', 'e1'],
}