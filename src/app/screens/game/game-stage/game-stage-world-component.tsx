import React from 'react';
import { observer } from 'mobx-react';
import { PlayerInfos } from '../../../../shared/model/v1/player-info';
import { WorldToDisplay } from '../../../view-model/game/game-stage-view-model';
import { VisibleWorld, visibleWorldhasOwner } from '../../../../shared/model/v1/visible-state';
import { symbol } from '../helper/symbols';

@observer
export class GameStageWorld extends React.Component<{
  world: WorldToDisplay,
  playerInfos: PlayerInfos
}> {
  render() {
    const { world } = this.props;

    const showCircle = !['UNKOWN', 'VOID', 'NEBULA'].includes(world.worldType.type)

    const color = this.getColorForWorld(world);

    const symbolColor = showCircle ? 'grey' : color;

    const opacity = world.status === 'HIDDEN' || world.status === 'FOG_OF_WAR' ? 0.5 : 1

    return ([
      showCircle && <circle
        cx={world.x}
        cy={world.y}
        r={12}
        fill={color}
        opacity={opacity}
      ></circle>,
      <text
        x={world.x}
        y={world.y}
        dominantBaseline="middle"
        textAnchor="middle"
        fill={symbolColor}
        fontSize={16}
        opacity={opacity}
        style={{ transform: "translateY(1px)" }}
      >{this.getWorldSymbol(world)}</text>
    ])
  }



  private getWorldSymbol(world: VisibleWorld) {
    switch (world.worldType.type) {
      case 'UNKOWN':
        return '?'
      case 'VOID':
        return ' ';
      case 'NEBULA':
        return '≋';
      case 'MINING':
        return symbol('metal') + '+';
      case 'DOUBLE':
        return '2x';
      case 'DEFENSIVE':
        return '⛨';
      case 'INDUSTRIAL':
        return symbol('industry') + '+';
      case 'INSPIRING':
        return symbol('influence') + '+';
      case 'LUSH':
        return symbol('population') + '+';
      case 'POPULATED':
        return '';
      case 'CREEP':
        return '';
      default:
        return '';
    }
  }

  getColorForWorld(world: VisibleWorld) {
    if (!visibleWorldhasOwner(world)) {
      return 'lightgray'
    } else {
      return this.getColorForPlayer(world.ownerId);
    }
  }

  getColorForPlayer(playerId: string) {
    return this.props.playerInfos[playerId]?.color ?? 'lightgray';
  }


}