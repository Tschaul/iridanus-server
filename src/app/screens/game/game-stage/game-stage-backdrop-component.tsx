import * as React from 'react';
import { observer } from 'mobx-react';
import { GameStageViewModel } from '../../../view-model/game/game-stage-view-model';
import { Vec2, diff, normal, add, mul } from '../../../../shared/math/vec2';
import { WORLD_OUTER_RADIUS, WORLD_STROKE, WORLD_BACKGROUND_COLOR } from './constants';


@observer
export class GameStageBackdrop extends React.Component<{
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

function d(v: Vec2) {
  return `${v.x} ${v.y}`
}

