import React from "react";
import { SelectedWorldViewModel } from "../../../view-model/game/selected-world-view-model";
import { Panel } from "../../../ui-components/panel/panel-component";
import { observer } from "mobx-react";
import { screenWhite, selectedYellow, hoverYellow } from "../../../ui-components/colors/colors";
import { Fleet } from "../../../../shared/model/v1/fleet";
import { World, WorldBeingCaptured } from "../../../../shared/model/v1/world";
import { PlayerInfo } from "../../../../shared/model/v1/player-info";
import autobind from "autobind-decorator";
import { getClosestAttribute } from "../../helper/get-attribute";
import { reaction } from "mobx";
import classNames from 'classnames'
import { createClasses, StyleSheet } from "../../../ui-components/setup-jss";
import { PanelDivider } from "../../../ui-components/panel/panel-divider";
import { HoverTooltip } from "../../../ui-components/tooltip/hover-tooltip.component";
import { getDisplayDuration } from "../../../ui-components/display-duration";
import { map } from "rxjs/operators";
import { of, Observable } from "rxjs";

const classes = createClasses({
  row: {
    transition: "color 0.3s",
    cursor: 'pointer',
    color: screenWhite,
    display: 'flex',
    "&.selected": {
      color: selectedYellow
    },
    "&:hover:not(.selected)": {
      color: hoverYellow
    },
  },
  col: {
    textAlign: 'right',
    marginLeft: '1ex'
  }
});

@observer
export class SelectedWorldPanel extends React.Component<{
  vm: SelectedWorldViewModel,
  panelClassName?: string,
}> {

  panel: Panel | null;

  render() {

    return this.renderPanel(
      <div>
        {this.renderWorldHeader()}
        {this.renderFleets()}
      </div>
    )
  }

  private renderFleets(): React.ReactNode {
    const world = this.props.vm.selectedWorld
    if (world?.status === 'REMEMBERED') {
      return <span>world not in sight</span>
    }
    return this.props.vm.fleetsAtStageSelection.map(fleet => {
      return this.renderFleetRow(fleet, fleet.owner);
    });
  }

  componentDidMount() {
    reaction(
      () => this.props.vm.selectedWorld && this.props.vm.selectedWorld.id,
      (id) => {
        if (this.panel) {
          this.panel.refreshAnimation();
        }
      }
    )
  }

  renderWorldHeader() {
    const world = this.props.vm.selectedWorld
    if (!world) {
      return (
        <span />
      )
    } else if (world.status === 'UNKNOWN') {
      return <div>unknown world</div>
    }
    else {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>{this.padSpaces(world.populationLimit)} <span style={{ textDecoration: 'overline' }}>P</span> &nbsp;</div>
            <div>{this.padSpaces(world.industry)} I &nbsp;</div>
            {/* <div>{this.padSpaces(world.mines)} M &nbsp;</div> */}
          </div>
          <PanelDivider></PanelDivider>
          {world.status !== 'REMEMBERED' && this.renderWorldRow(world, this.props.vm.fleetsAtStageSelection, this.props.vm.playerInfoOfSelectedWorld)}
        </div>
      )
    }
  }

  renderPanel(content: React.ReactElement) {
    return <Panel panelClassName={classNames(this.props.panelClassName)} ref={elem => this.panel = elem} fadeDirection="right">
      {content}
    </Panel>
  }

  renderFleetRow(fleet: Fleet, owner: PlayerInfo | null) {
    const selected = this.props.vm.isWorldOrFleetSelected(false, fleet);
    const topIcon = selected ? '■' : '·';

    const color = owner ? owner.color : screenWhite;

    const icon = '◈'

    return (
      <div className={classNames([classes.row, { selected }])} key={fleet.id} data-fleet-id={fleet.id} onClick={this.handleRowClick}>
        <div>{topIcon} </div>
        <div className={classes.col} style={{ color, width: '1em', display: 'inline-block', textAlign: 'center' }}>{icon}</div>
        {this.tableAmount(fleet.ships, '►')}
        {fleet.status === 'TRANSFERING_CARGO' && this.tableAmount(fleet.cargoMetal, '▮')}
        {fleet.status === 'TRANSFERING_CARGO' && this.tableAmount(fleet.cargoPopulation, 'P')}
        <div className={classes.col} style={{ width: "3em" }}>
          <HoverTooltip content$={this.getStatusTooltip(fleet)}>
            {this.fleetStatusIcon(fleet.status)}
          </HoverTooltip>
        </div>
      </div>
    )
  }

  renderWorldRow(world: World, fleets: Fleet[], owner: PlayerInfo | null) {
    const selected = this.props.vm.isWorldOrFleetSelected(true, world);
    const topIcon = selected ? '■' : '·';

    const color = owner ? owner.color : screenWhite;

    const icon = '◉';

    return (
      <div className={classNames([classes.row, { selected }])} key={world.id} data-fleet-id={null} onClick={this.handleRowClick}>
        <div>{topIcon} </div>
        <div className={classes.col} style={{ color, width: '1em', display: 'inline-block', textAlign: 'center' }}>{icon}</div>
        {this.tableAmount(world.metal, '▮')}
        {this.tableAmount(world.population, 'P')}
        <div className={classes.col} style={{ width: "3em" }}>
          <HoverTooltip content$={this.getStatusTooltip(world)}>
            {this.worldStatusIcon(world.status)}
          </HoverTooltip>
          {world.captureStatus === 'BEING_CAPTURED' && (
            <HoverTooltip content$={this.getCaptureTooltip(world)}>
              <span style={{color: this.props.vm.playerInfoOfWorldBeingCaptured?.color}}>⚑</span>
            </HoverTooltip>
          )}
        </div>
      </div>
    )
  }

  private getCaptureTooltip(item: WorldBeingCaptured): Observable<string> {
    const doneTimestamp = item.captureTimestamp
    return getDisplayDuration(doneTimestamp).pipe(map(duration => {
      return `${item.captureStatus} ${duration}`
    }))
  }

  private getStatusTooltip(item: World | Fleet): Observable<string> {
    const doneTimestamp = this.getDoneTimestamp(item);
    if (doneTimestamp) {
      return getDisplayDuration(doneTimestamp).pipe(map(duration => {
        return `${item.status} ${duration}`
      }))
    } else {
      return of(item.status)
    }
  }

  private getDoneTimestamp(item: World | Fleet): number | null {
    switch (item.status) {
      case 'BUILDING_SHIPS':
      case 'ARRIVING':
        return item.readyTimestamp
      case 'LEAVING':
        return item.warpingTimestamp;
      case 'WARPING':
        return item.arrivingTimestamp;
      default:
        return null;
    }
  }

  @autobind
  handleRowClick(event: React.MouseEvent) {
    const fleetId = getClosestAttribute(event, 'data-fleet-id');
    this.props.vm.selectFleetId(fleetId);
  }

  padSpaces(num: number) {
    if (num < 10) {
      return <span>&nbsp;{num}</span>;
    } else {
      return <span>{num}</span>;
    }
  }

  tableAmount(amount: number, symbol: string) {
    return <div className={classes.col} style={{ width: '8ex' }}>
      {amount}
      {' ' + symbol}
    </div>
  }

  fleetStatusIcon(status: Fleet['status']) {
    switch (status) {
      case 'WAITING_FOR_CARGO': return '⏾'
      case 'TRANSFERING_CARGO': return '⇄'
      case 'ARRIVING': return '🠰';
      case 'WARPING': return '🠲';
      case 'LEAVING': return '🠲';
      default: return ' ';
    }
  }

  worldStatusIcon(status: World['status']) {
    switch (status) {
      case 'BUILDING_SHIPS': return '+►';
      default: return ' ';
    }
  }
}