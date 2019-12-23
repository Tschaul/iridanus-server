import * as React from 'react';
import { observer } from 'mobx-react';
import { GameStageViewModel } from '../../../view-model/game/game-stage-view-model';
import autobind from "autobind-decorator";
import { World } from '../../../../shared/model/world';

const WORLD_OUTER_RADIUS = 50;

const FLEET_DISTANCE = 33;

@observer
@autobind
export class GameStageForeground extends React.Component<{
  vm: GameStageViewModel
}> {
  render() {
    return (
      <g opacity="1">
        {this.props.vm.worldsWithKeyAndDisplayPosition.map(world => {

          const color = this.getColorForWorld(world);

          const fleetOwners = this.props.vm.fleetOwnersByWorldId[world.id] || [];

          return (
            <g>
              <text
                x={world.x}
                y={world.y}
                dominantBaseline="middle"
                textAnchor="middle"
                fill={color}
                fontSize={33}
              >◉</text>
              {fleetOwners.map(ownerId => {
                const playerInfo = this.props.vm.playerInfos[ownerId];
                return (
                  <text
                    x={world.x + FLEET_DISTANCE * playerInfo.fleetDrawingPosition.x}
                    y={world.y + FLEET_DISTANCE * playerInfo.fleetDrawingPosition.y}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill={playerInfo.color}
                    fontSize={22}
                  >►</text>
                )
              })}
              <circle
                cx={world.x}
                cy={world.y}
                r={WORLD_OUTER_RADIUS}
                opacity="0"
                data-world-id={world.id}
                onClick={this.handleWorldClick}
                style={{cursor: 'pointer'}}
              />
            </g>
          )
        })}
      </g>
    )
  }

  handleWorldClick(event: React.MouseEvent) {
    const elem = event.target as SVGCircleElement;
    const worldId = elem.getAttribute('data-world-id');
    this.props.vm.selectWorld(worldId);
  }

  getColorForWorld(world: World) {
    if (world.status === 'LOST') {
      return 'grey'
    } else {
      return this.props.vm.playerInfos[world.ownerId].color;
    }
  }
}
