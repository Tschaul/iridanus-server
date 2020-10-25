import React from 'react';
import { observer } from 'mobx-react';
import { WorldToDisplay } from '../../../view-model/game/game-stage-view-model';
import { VisibleWorld, visibleWorldhasOwner } from '../../../../shared/model/v1/visible-state';
import { symbol } from '../helper/symbols';
import { PlayersViewModel } from '../../../view-model/game/player-infos-view-model';
import { IconSvg, IconType } from '../../../ui-components/icons/icon-svg-component';

@observer
export class GameStageWorld extends React.Component<{
  world: WorldToDisplay,
  playerInfos: PlayersViewModel
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
      this.getWorldSymbol(world, symbolColor, opacity)
    ])
  }

  private getWorldSymbol(world: WorldToDisplay, color: string, opacity: number) {
    switch (world.worldType.type) {
      case 'UNKOWN':
        return this.renderTextWorldIcon('?', world, color, opacity)
      case 'NEBULA':
        return this.renderTextWorldIcon('≋', world, color, opacity);
      case 'MINING':
        return this.renderSvgWorldIcon('metal', world, color, opacity);
      case 'DOUBLE':
        return this.renderTextWorldIcon('2x', world, color, opacity);
      case 'DEFENSIVE':
        return this.renderSvgWorldIcon('shield', world, color, opacity);
      case 'INDUSTRIAL':
        return this.renderSvgWorldIcon('industry', world, color, opacity);
      case 'INSPIRING':
        return this.renderTextWorldIcon(symbol('influence') + '+', world, color, opacity);
      case 'LUSH':
        return this.renderSvgWorldIcon('population', world, color, opacity);
      case 'HOME':
        return this.renderSvgWorldIcon('home', world, color, opacity, true);
      case 'VOID':
      default:
        return undefined;
    }
  }

  renderTextWorldIcon(text: string, world: WorldToDisplay, color: string, opacity: number) {
    return <text
      x={world.x}
      y={world.y}
      dominantBaseline="middle"
      textAnchor="middle"
      fill={color}
      fontSize={16}
      opacity={opacity}
      style={{ transform: "translateY(1px)" }}
    >{text}</text>
  }

  renderSvgWorldIcon(type: IconType, world: WorldToDisplay, color: string, opacity: number, hideBoost: boolean = false) {

    const boost = hideBoost ? [] : [<text
      x={world.x + 6}
      y={world.y + 0.5}
      dominantBaseline="middle"
      textAnchor="middle"
      fill={color}
      fontSize={10}
      opacity={opacity}
      style={{ transform: "translateY(1px)" }}
    >⌃</text>, <text
      x={world.x + 6}
      y={world.y + 4.5}
      dominantBaseline="middle"
      textAnchor="middle"
      fill={color}
      fontSize={10}
      opacity={opacity}
      style={{ transform: "translateY(1px)" }}
    >⌃</text>]

    return [...boost,
    <IconSvg
      type={type}
      x={world.x - (hideBoost ? 0 : 2)}
      y={world.y}
      color={color}
      size={10}
    />
    ]
  }

  getColorForWorld(world: VisibleWorld) {
    if (!visibleWorldhasOwner(world)) {
      return 'lightgray'
    } else {
      return this.props.playerInfos.getColorForPlayer(world.ownerId);
    }
  }

}