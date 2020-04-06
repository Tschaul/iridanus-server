import * as React from 'react';
import { observer } from 'mobx-react';
import { GameStageViewModel } from '../../../view-model/game/game-stage-view-model';
import autobind from "autobind-decorator";
import { World } from '../../../../shared/model/v1/world';
import { getClosestAttribute } from '../../helper/get-attribute';
import { mul, add, diff, normal, middle } from '../../../../shared/math/vec2';
import { FLEET_SPREAD_DURING_WARP, FLEET_DISTANCE, WORLD_OUTER_RADIUS } from './constants';
import { screenWhite, selectedYellow, screenWhiteRaw } from '../../../ui-components/colors/colors';
import { HoverTooltip } from '../../../ui-components/tooltip/hover-tooltip.component';
import { StaticTooltip } from '../../../ui-components/tooltip/static-tooltip.component';
import { VisibleWorld, visibleWorldhasOwner } from '../../../../shared/model/v1/visible-state';


@observer
@autobind
export class GameStageForeground extends React.Component<{
  vm: GameStageViewModel
}> {
  render() {
    return (
      <g opacity="1">
        {this.renderModeHint()}
        {this.renderWorlds()}
        {this.renderWarppingFleets()}
      </g>
    )
  }

  private renderModeHint() {
    switch (this.props.vm.mode.type) {
      case 'NORMAL':
        return <g />
      case 'SELECT_WORLD_TARGET':
        return <text fill={screenWhite} x="32" y="32">{this.props.vm.mode.description}</text>
    }
  }

  private renderWarppingFleets() {
    return this.props.vm.warpingFleetOwnersByBothWorlds.map(([id1, world1Pos, id2, world2Pos, fleetOwners]) => {

      const meanPosition = middle(world1Pos, world2Pos);

      const delta = diff(world1Pos, world2Pos);
      const n = normal(delta);

      const offset = ((fleetOwners.length - 1) / 2) * FLEET_SPREAD_DURING_WARP;
      const offsetPoint = diff(meanPosition, mul(n, offset));
      const step = mul(n, FLEET_SPREAD_DURING_WARP);

      const hint = this.props.vm.hintForGate(id1, id2);


      return <g key={`${id1}:${id2}`}>
        {fleetOwners.map((ownerId, index) => {
          const playerInfo = this.props.vm.playerInfos[ownerId];
          const pos = add(offsetPoint, mul(step, index))
          return (
            <StaticTooltip svg content={hint}>
              <text
                key={ownerId}
                x={pos.x}
                y={pos.y}
                dominantBaseline="middle"
                textAnchor="middle"
                fill={playerInfo.color}
                fontSize={22}
                data-world-id1={id1}
                data-world-id2={id2}
                onClick={this.handleGateClick}
                cursor='pointer'
              >◈</text>
            </StaticTooltip>
          );
        })}
      </g>
    })
  }

  private renderWorlds(): React.ReactNode {
    return this.props.vm.worldsToDisplay.map(world => {
      const color = this.getColorForWorld(world);
      const fleetOwners = this.props.vm.fleetOwnersByWorldId[world.id] || [];
      const selected = this.props.vm.selectedWorld && this.props.vm.selectedWorld.id === world.id;
      const hint = this.props.vm.hintForWorld(world.id);
      const opacity = world.status === 'UNKNOWN' || world.status === 'REMEBERED' ? 0.5 : 1
      return (
        <g key={world.id}>
          <text
            x={world.x}
            y={world.y}
            dominantBaseline="middle"
            textAnchor="middle"
            fill={color}
            fontSize={33}
            style={{ transform: "translateY(1px)" }}
            opacity={opacity}
          >{/*world.id*/}◉</text>
          {fleetOwners.map(ownerId => {
            const playerInfo = this.props.vm.playerInfos[ownerId];
            return (
              <text
                key={ownerId}
                x={world.x + FLEET_DISTANCE * playerInfo.fleetDrawingPosition.x}
                y={world.y + FLEET_DISTANCE * playerInfo.fleetDrawingPosition.y}
                dominantBaseline="middle"
                textAnchor="middle"
                fill={playerInfo.color}
                fontSize={22}
              >◈</text>);
          })}
          <HoverTooltip
            svg={true}
            content={this.getTooltipForWorld(world)}
          >
            <StaticTooltip svg content={hint}>
              {selected && (
                <circle
                  cx={world.x}
                  cy={world.y}
                  r={WORLD_OUTER_RADIUS}
                  opacity="1"
                  stroke={selectedYellow}
                  fill="none"
                  strokeWidth="3"
                  strokeDasharray="10,10"
                  data-world-id={world.id}
                  onClick={this.handleWorldClick}
                  style={{ cursor: 'pointer' }}
                />
              )}
              {world.hasUnreadNotifications && (
                <circle
                  cx={world.x}
                  cy={world.y}
                  r={WORLD_OUTER_RADIUS}
                  opacity="1"
                  stroke={screenWhiteRaw.fade(0.5).toString()}
                  fill="none"
                  strokeWidth="3"
                  strokeDasharray="10,10"
                  data-world-id={world.id}
                  onClick={this.handleWorldClick}
                  style={{ cursor: 'pointer' }}
                />
              )}
              <circle
                cx={world.x}
                cy={world.y}
                r={WORLD_OUTER_RADIUS}
                opacity="0"
                data-world-id={world.id}
                onClick={this.handleWorldClick}
                style={{ cursor: 'pointer' }}
              />
            </StaticTooltip>
          </HoverTooltip>
        </g>);
    });
  }

  @autobind
  handleWorldClick(event: React.MouseEvent) {
    const worldId = getClosestAttribute(event, 'data-world-id');
    this.props.vm.selectWorld(worldId);
  }

  @autobind
  handleGateClick(event: React.MouseEvent) {
    const world1Id = getClosestAttribute(event, 'data-world-id1');
    const world2Id = getClosestAttribute(event, 'data-world-id2');
    if (world1Id && world2Id) {
      this.props.vm.selectGate(world1Id, world2Id);
    }
  }

  getColorForWorld(world: VisibleWorld) {
    if (!visibleWorldhasOwner(world)) {
      return 'lightgray'
    } else {
      return this.props.vm.playerInfos[world.ownerId].color;
    }
  }

  getTooltipForWorld(world: VisibleWorld) {
    if (world.status === 'UNKNOWN') {
      return '';
    }
    return <span>
      {world.population}/{world.populationLimit} P {world.industry} I {world.mines} M <br />
    </span>
  }
}
