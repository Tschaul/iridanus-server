import * as React from 'react';
import { observer } from 'mobx-react';
import { GameStageViewModel } from '../../../view-model/game/game-stage-view-model';

const WORLD_OUTER_RADIUS = 50;

const WORLD_BACKGROUND_COLOR = 'rgba(128, 151, 158, 1)';
const WORLD_STROKE = 'rgba(230, 230, 230, 1)';

@observer
export class GameBackdropComponent extends React.Component<{
  vm: GameStageViewModel
}> {
  render() {
    return (
      <g opacity="0.29">
        <clipPath id="clipPath">
          {this.props.vm.worldsWithKeyAndDisplayPosition.map(world => {
            return (
              <circle
                cx={world.x}
                cy={world.y}
                r={WORLD_OUTER_RADIUS}
              />
            )
          })}
          {this.props.vm.gatesWithDisplayPosition.map(gate => {
            const start = {
              x: gate.xStart,
              y: gate.yStart
            }
            const end = {
              x: gate.xEnd,
              y: gate.yEnd
            }
            const delta = diff(end, start);
            const n = normal(delta);
            const width = 10;
            const path = 'M' +
              d(add(start, mul(n, width))) +
              'L' +
              d(add(end, mul(n, width))) +
              'L' +
              d(add(end, mul(n, -1 * width))) +
              'L' +
              d(add(start, mul(n, -1 * width))) +
              'Z';
            return (
              <path d={path}></path>
            )
          })}
        </clipPath>
        <filter id="backdropBorder">
          <feMorphology operator="dilate" radius="2"></feMorphology>
        </filter>
        <g filter="url(#backdropBorder)">
          <rect width="100%" height="100%" fill={WORLD_STROKE} 
            clip-path="url(#clipPath)" />

        </g>
        <rect width="100%" height="100%" fill={WORLD_BACKGROUND_COLOR}
          clip-path="url(#clipPath)" />
      </g>
    )
  }
}

type Vec2 = { x: number, y: number };

function d(v: Vec2) {
  return `${v.x} ${v.y}`
}

function mul(v1: Vec2, m: number): Vec2 {
  return {
    x: v1.x * m,
    y: v1.y * m
  }
}

function diff(v1: Vec2, v2: Vec2) {
  return add(v1, mul(v2, -1));
}

function add(v1: Vec2, v2: Vec2): Vec2 {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y
  }
}

function normal(v: Vec2) {

  const rawNormal = {
    x: -v.y,
    y: v.x,
  }
  const a = abs(rawNormal);
  return {
    x: rawNormal.x / a,
    y: rawNormal.y / a,
  }
}

function abs(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}