import React from 'react';
import { observer } from 'mobx-react';
import { GameStageViewModel } from '../../../view-model/game/game-stage-view-model';
import autobind from "autobind-decorator";
import { getClosestAttribute } from '../../helper/get-attribute';
import { mul, diff, normalize, abs, distributeOnCircle } from '../../../../shared/math/vec2';
import { FLEET_DISTANCE, WORLD_OUTER_RADIUS, FLEET_OUTER_RADIUS } from './constants';
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
        {this.renderWarppingFleets()}
        {this.renderWorlds()}
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
              onContextMenu={this.handleGateRightClick}
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

      return <g key={`${id1}:${id2}`}>
        {fleets.map((fleet) => {

          const [fromId] = pathOfFleetInTransit(fleet);

          const relPos = fromId === id1 ? fleet.transitPosition : (1 - fleet.transitPosition);

          const playerInfo = this.props.vm.playerInfos[fleet.ownerId];
          const rel = mul(parallel, WORLD_OUTER_RADIUS + relPos * (dist - 2 * WORLD_OUTER_RADIUS))

          const idle = fleet.status === 'WAITING_FOR_CARGO';
          return (
            <g key={fleet.id}
              transform={`translate(${rel.x},${rel.y})`}
            >
              {idle && (
                <circle
                  cx={world1Pos.x}
                  cy={world1Pos.y}
                  r={FLEET_OUTER_RADIUS}
                  opacity="1"
                  stroke={screenWhiteRaw.fade(0.5).toString()}
                  fill="none"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  data-world-id1={id1}
                  data-world-id2={id2}
                  data-fleet-id={fleet.id}
                  onClick={this.handleGateClick}
                  onContextMenu={this.handleGateRightClick}
                  style={{ cursor: 'pointer' }}
                />
              )}
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
                data-fleet-id={fleet.id}
                onClick={this.handleGateClick}
                onContextMenu={this.handleGateRightClick}
                cursor='pointer'
              >►</text>
            </g>
          );
        })}
      </g>
    })
  }

  private renderWorlds(): React.ReactNode {
    return this.props.vm.worldsToDisplay.map(world => {
      const color = this.getColorForWorld(world);
      const fleets = this.props.vm.fleetsByWorldId[world.id] || [];
      const selected = this.props.vm.selectedWorld && this.props.vm.selectedWorld.id === world.id;
      const hint = this.props.vm.hintForWorld(world.id);
      const opacity = world.status === 'UNKNOWN' || world.status === 'FOG_OF_WAR' ? 0.5 : 1

      const positions = distributeOnCircle(fleets.length);

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
          >{/*world.id*/ '◉'}</text>
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
                  onContextMenu={this.handleWorldRightClick}
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
                  onContextMenu={this.handleWorldRightClick}
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
                onContextMenu={this.handleWorldRightClick}
                style={{ cursor: 'pointer' }}
              />
            </StaticTooltip>
          </HoverTooltip>
          {fleets.map((fleet, index) => {
            const playerInfo = this.props.vm.playerInfos[fleet.ownerId];
            const idle = fleet.status === 'READY' && !fleet.orders.length
            const pos = positions[index]
            return (
              <g key={fleet.id}>
                {idle && (
                  <circle
                    cx={world.x + FLEET_DISTANCE * pos.x}
                    cy={world.y + FLEET_DISTANCE * pos.y}
                    r={FLEET_OUTER_RADIUS}
                    opacity="1"
                    stroke={screenWhiteRaw.fade(0.5).toString()}
                    fill="none"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    data-world-id={world.id}
                    data-fleet-id={fleet.id}
                    onClick={this.handleWorldClick}
                    onContextMenu={this.handleWorldRightClick}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                <text
                  key={fleet.id}
                  x={world.x + FLEET_DISTANCE * pos.x}
                  y={world.y + FLEET_DISTANCE * pos.y}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill={playerInfo.color}
                  fontSize={22}
                  style={{ transform: "translateY(1px)", cursor: 'pointer' }}
                  data-world-id={world.id}
                  data-fleet-id={fleet.id}
                  onClick={this.handleWorldClick}
                  onContextMenu={this.handleWorldRightClick}
                >►</text>
              </g>
            );
          })}
        </g>);
    });
  }

  @autobind
  handleWorldClick(event: React.MouseEvent) {
    const worldId = getClosestAttribute(event, 'data-world-id');
    this.props.vm.selectWorld(worldId);
    const fleetId = getClosestAttribute(event, 'data-fleet-id');
    if (fleetId) {
      this.props.vm.selectFleet(fleetId)
    }
  }

  @autobind
  handleWorldRightClick(event: React.MouseEvent) {
    const worldId = getClosestAttribute(event, 'data-world-id');
    if (worldId) {
      this.props.vm.sendFleetToWorld(worldId)
    }
  }

  @autobind
  handleGateClick(event: React.MouseEvent) {
    const world1Id = getClosestAttribute(event, 'data-world-id1');
    const world2Id = getClosestAttribute(event, 'data-world-id2');
    if (world1Id && world2Id) {
      this.props.vm.selectGate(world1Id, world2Id);
    }
    const fleetId = getClosestAttribute(event, 'data-fleet-id');
    if (fleetId) {
      this.props.vm.selectFleet(fleetId)
    }
  }

  @autobind
  handleGateRightClick(event: React.MouseEvent) {
    const world1Id = getClosestAttribute(event, 'data-world-id1');
    const world2Id = getClosestAttribute(event, 'data-world-id2');
    if (world1Id && world2Id) {
      this.props.vm.sendFleetToGate(world1Id, world2Id)
    }
  }

  getColorForWorld(world: VisibleWorld) {
    if (!visibleWorldhasOwner(world)) {
      return 'lightgray'
    } else {
      if (!this.props.vm.playerInfos[world.ownerId]) {
        console.log(this.props.vm.playerInfos, world.ownerId)
      }
      return this.props.vm.playerInfos[world.ownerId].color;
    }
  }

  getTooltipForWorld(world: VisibleWorld) {
    if (world.status === 'UNKNOWN') {
      return '';
    } else if (world.status === 'FOG_OF_WAR') {
      return `${JSON.stringify(world.population)}/${world.populationLimit} P ${world.industry} I`;
    }
    return `${JSON.stringify((world as any).population)}/${world.populationLimit} P ${world.industry} I ${world.metal} ▮`;

  }
}
