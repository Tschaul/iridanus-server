import { Gates, Universe } from "../../shared/model/v1/universe";
import { makeHexCoordinates } from "./make-hex-coordinates";
import { Vec2 } from "../../shared/math/vec2";
import { LostWorld } from "../../shared/model/v1/world";
import { DrawingPositions } from "../../shared/model/v1/drawing-positions";

export function makeGomeisaThree() {
  const worldPositions = makeHexCoordinates(4, 1);

  const universe: Universe = {
    fleets: {},
    worlds: {},
    gates
  }

  const drawingPositions: DrawingPositions = {}

  Object.getOwnPropertyNames(worldPositions).forEach(worldId => {
    const [x, y] = worldPositions[worldId];
    const position: Vec2 = { x, y }
    universe.worlds[worldId] = makeWorld(worldId);
    drawingPositions[worldId] = position;
  })

  return {
    universe,
    drawingPositions
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
    ships: 1,
    status: 'LOST'
  }
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