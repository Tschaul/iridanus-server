import { diff, normal, mul, add, Vec2, normalize } from "../../../../shared/math/vec2";
import { WARP_LANE_WIDTH, WORLD_OUTER_RADIUS, BACKDROP_BORDER } from "./constants";
import { GateWithStartAndEndPosition } from "../../../view-model/game/game-stage-view-model";

export function pathForGate(gate: GateWithStartAndEndPosition) {
  const worldStart = {
    x: gate.xFrom,
    y: gate.yFrom
  };
  const worldEnd = {
    x: gate.xTo,
    y: gate.yTo
  };
  const delta = diff(worldEnd, worldStart);
  const parallel = normalize(delta);
  const orthogonal = normal(delta);

  const start = add(worldStart, mul(parallel, (WORLD_OUTER_RADIUS - BACKDROP_BORDER - 1)))
  const end = add(worldEnd, mul(parallel, -1 * (WORLD_OUTER_RADIUS - BACKDROP_BORDER - 1)))

  const width = WARP_LANE_WIDTH / 2;
  const path = 'M' +
    d(add(start, mul(orthogonal, width))) +
    'L' +
    d(add(end, mul(orthogonal, width))) +
    'L' +
    d(add(end, mul(orthogonal, -1 * width))) +
    'L' +
    d(add(start, mul(orthogonal, -1 * width))) +
    'Z';
  return path;
}

function d(v: Vec2) {
  return `${v.x} ${v.y}`
}