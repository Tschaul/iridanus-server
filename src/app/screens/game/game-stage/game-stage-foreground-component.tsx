import * as React from 'react';
import { observer } from 'mobx-react';
import { GameStageViewModel } from '../../../view-model/game/game-stage-view-model';
import autobind from "autobind-decorator";
import { World } from '../../../../shared/model/v1/world';
import { getClosestAttribute } from '../../helper/get-attribute';
import { mul, add, diff, normal, middle, normalize, abs } from '../../../../shared/math/vec2';
import { FLEET_SPREAD_DURING_WARP, FLEET_DISTANCE, WORLD_OUTER_RADIUS, FLEET_OUTER_RADIUS } from './constants';
import { screenWhite, selectedYellow, screenWhiteRaw } from '../../../ui-components/colors/colors';
import { HoverTooltip } from '../../../ui-components/tooltip/hover-tooltip.component';
import { StaticTooltip } from '../../../ui-components/tooltip/static-tooltip.component';
import { VisibleWorld, visibleWorldhasOwner } from '../../../../shared/model/v1/visible-state';
import { pathForGate } from './helper';
import { pathOfFleetInTransit } from '../../../../shared/model/v1/fleet';


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
        {this.renderGateHitBoxes()}
      </g>
    )
  }

  private renderModeHint() {
    switch (this.props.vm.mode.type) {
      case 'NORMAL':
        return <g />
      default:
        return <text fill={screenWhite} x="32" y="32">{this.props.vm.mode.description}</text>
    }
  }

  private renderGateHitBoxes() {

    return <g>
      {this.props.vm.gatesWithDisplayPosition.map((gate, index) => {
        const hint = this.props.vm.hintForGate(gate.worldFromId, gate.worldToId);

        const path = pathForGate(gate);

        return (
          <StaticTooltip svg content={hint} key={gate.worldFromId + '_' + gate.worldToId}>
            <path
              key={index}
              d={path}
              data-world-id1={gate.worldFromId}
              data-world-id2={gate.worldToId}
              onClick={this.handleGateClick}
              opacity="0"
              style={{ cursor: 'pointer' }}
            ></path>
          </StaticTooltip>
        )
      })}
    </g>
  }

  private renderWarppingFleets() {
    return this.props.vm.warpingFleetsByBothWorlds.map(([id1, world1Pos, id2, world2Pos, fleets]) => {

      const delta = diff(world2Pos, world1Pos);
      const dist = abs(delta);
      const parallel = normalize(delta);

      // const offset = ((fleetOwners.length - 1) / 2) * FLEET_SPREAD_DURING_WARP;
      // const offsetPoint = diff(meanPosition, mul(n, offset));
      // const step = mul(n, FLEET_SPREAD_DURING_WARP);



      return <g key={`${id1}:${id2}`}>
        {fleets.map((fleet, index) => {

          const [fromId, toId] = pathOfFleetInTransit(fleet);

          const relPos = fromId === id1 ? fleet.transitPosition : (1 - fleet.transitPosition);

          const playerInfo = this.props.vm.playerInfos[fleet.ownerId];
          const rel = mul(parallel, WORLD_OUTER_RADIUS + relPos * (dist - 2 * WORLD_OUTER_RADIUS))
          console.log(rel)
          return (
            <g
              transform={`translate(${rel.x},${rel.y})`}
            >
              <text
                key={fleet.id}
                x={world1Pos.x}
                y={world1Pos.y}
                dominantBaseline="middle"
                textAnchor="middle"
                fill={playerInfo.color}
                fontSize={22}
                data-world-id1={id1}
                data-world-id2={id2}
                onClick={this.handleGateClick}
                cursor='pointer'
              >◈</text>
            </g>
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
      const opacity = world.status === 'UNKNOWN' || world.status === 'REMEMBERED' ? 0.5 : 1
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
            const idleOwnersAtWorld = this.props.vm.idleFleetOwnersByWorldId[world.id];
            const idle = idleOwnersAtWorld && idleOwnersAtWorld.includes(ownerId);
            return (
              <g>
                {idle && (
                  <circle
                    cx={world.x + FLEET_DISTANCE * playerInfo.fleetDrawingPosition.x}
                    cy={world.y + FLEET_DISTANCE * playerInfo.fleetDrawingPosition.y}
                    r={FLEET_OUTER_RADIUS}
                    opacity="1"
                    stroke={screenWhiteRaw.fade(0.5).toString()}
                    fill="none"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    data-world-id={world.id}
                  />
                )}
                <text
                  key={ownerId}
                  x={world.x + FLEET_DISTANCE * playerInfo.fleetDrawingPosition.x}
                  y={world.y + FLEET_DISTANCE * playerInfo.fleetDrawingPosition.y}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill={playerInfo.color}
                  fontSize={22}
                  style={{ transform: "translateY(1px)" }}
                >◈</text>
              </g>
            );
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
    return `${world.population}/${world.populationLimit} P ${world.industry} I ${world.mines} M`;
  }
}
