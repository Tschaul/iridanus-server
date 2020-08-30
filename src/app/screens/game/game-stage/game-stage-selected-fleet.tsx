import * as React from 'react';
import { observer } from 'mobx-react';
import { GameStageViewModel } from '../../../view-model/game/game-stage-view-model';
import autobind from "autobind-decorator";
import { Fleet, fleetIsAtWorld, WarpingFleet } from '../../../../shared/model/v1/fleet';
import { middle, diff, shorten, add } from '../../../../shared/math/vec2';
import { WORLD_OUTER_RADIUS } from './constants';
import { screenWhite } from '../../../ui-components/colors/colors';
import { WarpOrder } from '../../../../shared/model/v1/fleet-orders';
import { assertNever } from '../../../../shared/util/assert-never';

@observer
@autobind
export class GameStageSelectedFleet extends React.Component<{
  vm: GameStageViewModel
}> {
  render() {
    if (!this.props.vm.selectedFleet) {
      return <g />
    } else {
      const fleet = this.props.vm.selectedFleet;

      return <g>
        <defs>
          <marker id="arrow" markerWidth="4.5" markerHeight="4.5" refX="0" refY="1.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,3 L4.5,1.5 z" fill={screenWhite} />
          </marker>
        </defs>
        {this.renderCurrentWarpingPath(fleet)}
        {this.renderWarpOrderPath(fleet)}
      </g>
    }

  }

  private getCurrentWorld(fleet: Fleet): string {
    if (fleetIsAtWorld(fleet)) {
      return fleet.currentWorldId;
    }

    if (fleet.status === 'WARPING') {
      return fleet.targetWorldId
    }

    if (fleet.status === 'TRANSFERING_CARGO') {
      return fleet.toWorldId
    }

    if (fleet.status === 'WAITING_FOR_CARGO') {
      return fleet.fromWorldId
    }

    assertNever(fleet);
  }

  renderWarpOrderPath(fleet: Fleet) {
    let currentWorldId = this.getCurrentWorld(fleet);

    const warpOrders = fleet.orders.filter(order => order.type === 'WARP') as WarpOrder[];

    if (fleet.status === 'LEAVING') {
      warpOrders.unshift({
        targetWorldId: fleet.targetWorldId,
        type: 'WARP'
      })
    }

    const result = [];

    for (const warpOrder of warpOrders) {
      const destinationWorldId = warpOrder.targetWorldId;

      const originWorldPos = this.props.vm.drawingPositons[currentWorldId];
      const targetWorldPos = this.props.vm.drawingPositons[destinationWorldId];

      const center = middle(originWorldPos, targetWorldPos);

      const deltaOrigin = shorten(diff(originWorldPos, center), WORLD_OUTER_RADIUS - 2.25)

      const arrowStart = add(center, deltaOrigin);

      const deltaTarget = shorten(diff(targetWorldPos, center), WORLD_OUTER_RADIUS + 2.25)

      const arrowEnd = add(center, deltaTarget);

      result.push(
        <line
          key={result.length}
          x1={arrowStart.x}
          y1={arrowStart.y}
          x2={arrowEnd.x}
          y2={arrowEnd.y}
          stroke={screenWhite}
          strokeWidth="3"
          markerEnd="url(#arrow)"
        />
      )

      currentWorldId = destinationWorldId;
    }

    return result;
  }

  renderCurrentWarpingPath(fleet: Fleet) {
    if (!fleetIsAtWorld(fleet)) {
      const warpingFleet = fleet as WarpingFleet;

      const originWorldPos = this.props.vm.drawingPositons[warpingFleet.originWorldId];
      const targetWorldPos = this.props.vm.drawingPositons[warpingFleet.targetWorldId];

      const arrowStart = middle(originWorldPos, targetWorldPos);

      const delta = shorten(diff(targetWorldPos, arrowStart), WORLD_OUTER_RADIUS + 2.25)

      const arrowEnd = add(arrowStart, delta);

      return <line
        key="current"
        x1={arrowStart.x}
        y1={arrowStart.y}
        x2={arrowEnd.x}
        y2={arrowEnd.y}
        stroke={screenWhite}
        strokeWidth="3"
        markerEnd="url(#arrow)"
      />

    } else {
      return;
    }
  }
}