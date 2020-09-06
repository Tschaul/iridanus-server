import React from 'react';
import { observer } from 'mobx-react';
import { GameStageViewModel, GateWithStartAndEndPosition } from '../../../view-model/game/game-stage-view-model';
import { Vec2, diff, normal, add, mul } from '../../../../shared/math/vec2';
import { WORLD_OUTER_RADIUS, WORLD_STROKE, WORLD_BACKGROUND_COLOR, WARP_LANE_WIDTH, BACKDROP_BORDER } from './constants';
import { pathForGate } from './helper';


@observer
export class GameStageBackdrop extends React.Component<{
  vm: GameStageViewModel
}> {
  render() {
    return (
      <g opacity="0.29">
        <clipPath id="clipPath">
          {this.props.vm.worldsToDisplay.map(world => {
            return (
              <circle
                key={world.id}
                cx={world.x}
                cy={world.y}
                r={WORLD_OUTER_RADIUS}
              />
            )
          })}
          {this.props.vm.gatesWithDisplayPosition.map((gate, index) => {
            const path = pathForGate(gate);
            return (
              <path key={index} d={path}></path>
            )
          })}
        </clipPath>
        <filter id="backdropBorder">
          <feMorphology operator="dilate" radius={BACKDROP_BORDER}></feMorphology>
        </filter>
        <g filter="url(#backdropBorder)">
          <rect width="100%" height="100%" fill={WORLD_STROKE} 
            clipPath="url(#clipPath)" />

        </g>
        <rect width="100%" height="100%" fill={WORLD_BACKGROUND_COLOR}
          clipPath="url(#clipPath)" />
      </g>
    )
  }
}

