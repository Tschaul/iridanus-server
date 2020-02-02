import { MapCoordinates } from "./make-hex-coordinates";

export function scaleMapCoordinates(map: MapCoordinates): MapCoordinates {

  const xValues = Object.values(map).map(it => it[0]);
  const yValues = Object.values(map).map(it => it[1]);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const result: MapCoordinates = {}

  Object.getOwnPropertyNames(map).forEach(key => {
    const [x, y] = map[key];
    result[key] = [
      ( x - xMin) / (xMax - xMin),
      (-1 *y - yMin) / (yMax - yMin),
    ]
  })

  return result;
}