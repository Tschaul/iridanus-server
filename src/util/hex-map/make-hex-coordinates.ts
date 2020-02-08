import { scaleMapCoordinates } from "./scale-coordinates";

export interface MapCoordinates {
  [key: string]: [number, number]
}

export function getRank(worldId: string) {
  const firstLetter = worldId[0];
  switch (firstLetter) {
    case 'a':
      return 1;
    case 'b':
      return 2;
    case 'c':
      return 3;
    case 'd':
      return 4;
    case 'e':
      return 5;
    default:
      throw new Error('Unknown rank')
  }
}

export function makeHexCoordinates(maxRanks: number, hexRadius: number) {

  const h = Math.sqrt(3) * hexRadius;
  const s = 1.5 * hexRadius;

  const result: MapCoordinates = {}

  if (maxRanks >= 1) {
    result['a1'] = [0, 0]
  }

  if (maxRanks >= 2) {
    result['b1'] = [0 * s, 2 * h];
    result['b2'] = [1 * s, 1 * h];
    result['b3'] = [1 * s, -1 * h];
    result['b4'] = [0 * s, -2 * h];
    result['b5'] = [-1 * s, -1 * h];
    result['b6'] = [-1 * s, 1 * h];
  }

  if (maxRanks >= 3) {
    result['c1'] = [0 * s, 4 * h];
    result['c2'] = [1 * s, 3 * h];
    result['c3'] = [2 * s, 2 * h];
    result['c4'] = [2 * s, 0 * h];
    result['c5'] = [2 * s, -2 * h];
    result['c6'] = [1 * s, -3 * h];
    result['c7'] = [0 * s, -4 * h];
    result['c8'] = [-1 * s, -3 * h];
    result['c9'] = [-2 * s, -2 * h];
    result['c10'] = [-2 * s, 0 * h];
    result['c11'] = [-2 * s, 2 * h];
    result['c12'] = [-1 * s, 3 * h];
  }

  if (maxRanks >= 4) {
    result['d1'] = [0 * s, 6 * h];
    result['d2'] = [1 * s, 5 * h];
    result['d3'] = [2 * s, 4 * h];
    result['d4'] = [3 * s, 3 * h];
    result['d5'] = [3 * s, 1 * h];
    result['d6'] = [3 * s, -1 * h];
    result['d7'] = [3 * s, -3 * h];
    result['d8'] = [2 * s, -4 * h];
    result['d9'] = [1 * s, -5 * h];
    result['d10'] = [0 * s, -6 * h];
    result['d11'] = [-1 * s, -5 * h];
    result['d12'] = [-2 * s, -4 * h];
    result['d13'] = [-3 * s, -3 * h];
    result['d14'] = [-3 * s, -1 * h];
    result['d15'] = [-3 * s, 1 * h];
    result['d16'] = [-3 * s, 3 * h];
    result['d17'] = [-2 * s, 4 * h];
    result['d18'] = [-1 * s, 5 * h];
  }

  if (maxRanks >= 5) {
    result['e1'] = [0 * s, 8 * h];
    result['e2'] = [1 * s, 7 * h];
    result['e3'] = [2 * s, 6 * h];
    result['e4'] = [3 * s, 5 * h];
    result['e5'] = [4 * s, 4 * h];
    result['e6'] = [4 * s, 2 * h];
    result['e7'] = [4 * s, 0 * h];
    result['e8'] = [4 * s, -2 * h];
    result['e9'] = [4 * s, -4 * h];
    result['e10'] = [3 * s, -5 * h];
    result['e11'] = [2 * s, -6 * h];
    result['e12'] = [1 * s, -7 * h];
    result['e13'] = [0 * s, -8 * h];
    result['e14'] = [-1 * s, -7 * h];
    result['e15'] = [-2 * s, -6 * h];
    result['e16'] = [-3 * s, -5 * h];
    result['e17'] = [-4 * s, -4 * h];
    result['e18'] = [-4 * s, -2 * h];
    result['e19'] = [-4 * s, 0 * h];
    result['e20'] = [-4 * s, 2 * h];
    result['e21'] = [-4 * s, 4 * h];
    result['e22'] = [-3 * s, 5 * h];
    result['e23'] = [-2 * s, 6 * h];
    result['e24'] = [-1 * s, 7 * h];
  }

  return scaleMapCoordinates(result);
}