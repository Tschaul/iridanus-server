import React from "react";
import { SelectedWorldViewModel } from "../../../view-model/game/selected-world-view-model";
import { Panel } from "../../../ui-components/panel/panel-component";
import { observer } from "mobx-react";
import { screenWhite, selectedYellow, hoverYellow } from "../../../ui-components/colors/colors";
import { Fleet } from "../../../../shared/model/v1/fleet";
import { PopulationByPlayer, World, WorldBeingCaptured, worldHasOwner } from "../../../../shared/model/v1/world";
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
import { symbol } from "../helper/symbols";
import { visibleWorldhasOwner } from "../../../../shared/model/v1/visible-state";
import { PopulationStats } from "../shared/population-stats-component";
import { WorldType } from "../../../../shared/model/v1/world-type";

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
    marginLeft: '2ex'
  },
  colRight: {
    textAlign: 'left',
    marginRight: '2ex'
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
    if (world?.status === 'FOG_OF_WAR') {
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
    } else if (world.status === 'HIDDEN') {
      return <div>unknown world</div>
    }
    else {
      const population: PopulationByPlayer = world.status === 'LOST' ? {} : world.population;
      return (
        <div>
          <div style={{ display: 'flex' }}>
            <span style={{ color: this.props.vm.colorOfSelectedWorld }}>⬤</span>
            <HoverTooltip content={this.getWorldTypeTooltip(world.worldType)}>
              <span className={classes.col}>{world.worldType.type}</span>
            </HoverTooltip>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className={classes.colRight}><PopulationStats population={population} playerInfos={this.props.vm.players}></PopulationStats>/{world.populationLimit}</div>
            <div className={classes.colRight}>{world.industry}&thinsp;{symbol('industry')} </div>
            {world.mines !== 0 && <div className={classes.colRight}>{world.mines}&thinsp;M</div>}
            {visibleWorldhasOwner(world) && world.miningStatus?.type === 'MINING' && (
              <HoverTooltip content$={getDisplayDuration(world.miningStatus.nextMetalMinedTimestamp).pipe(map(duration => {
                return `Mining ${duration}`
              }))}>
                <span className={classes.colRight}>{symbol('metal')}&thinsp;+</span>
              </HoverTooltip>
            )}
            {visibleWorldhasOwner(world) && world.populationGrowthStatus?.type === 'GROWING' && (
              <HoverTooltip content={'Growing'}>
                <span className={classes.colRight}>{symbol('population')}&thinsp;+</span>
              </HoverTooltip>
            )}
            {visibleWorldhasOwner(world) && world.buildShipsStatus?.type === 'BUILDING_SHIPS' && (
              <HoverTooltip content$={getDisplayDuration(world.buildShipsStatus.readyTimestamp).pipe(map(duration => {
                return `Builing ships ${duration}`
              }))}>
                <span className={classes.colRight} >{symbol('ships')}&thinsp;+</span>
              </HoverTooltip>
            )}
            {visibleWorldhasOwner(world) && world.populationConversionStatus?.type === 'BEING_CAPTURED' && (
              <HoverTooltip content={this.getCaptureTooltip(world.populationConversionStatus)}>
                <span className={classes.colRight} style={{ color: this.props.vm.colorOrCapturingPlayer }}>⚑</span>
              </HoverTooltip>
            )}
          </div>
          <PanelDivider></PanelDivider>
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
    const topIcon = selected ? '☒' : '☐';

    const color = owner ? owner.color : screenWhite;

    return (
      <div className={classNames([classes.row, { selected }])} key={fleet.id} data-fleet-id={fleet.id} onClick={this.handleRowClick}>
        <div style={{ color, width: '1em', display: 'inline-block', textAlign: 'center' }}>◆</div>
        <div className={classes.col}>{fleet.ships}&thinsp;{'►'}</div>
        {fleet.status === 'TRANSFERING_CARGO' && <div className={classes.col}>{fleet.cargoMetal}&thinsp;{symbol('metal')}</div>}
        {fleet.status === 'TRANSFERING_CARGO' && <div className={classes.col}>{fleet.cargoPopulation}&thinsp;{symbol('population')}</div>}
        <div>
          <HoverTooltip content$={this.getStatusTooltip(fleet)}>
            <span className={classes.col}> {this.fleetStatusIcon(fleet.status)} </span>
          </HoverTooltip>
        </div>
        {this.props.vm.showDamageStatusForFleet(fleet) && <div>
          <HoverTooltip content={'Fleet absorbed damage'}>
            <span className={classes.col}>⛨</span>
          </HoverTooltip>
        </div>}
        {fleet.integrity < 0.75 && <div>
          <HoverTooltip content={'Fleet is damaged'}>
            <span className={classes.col}>{this.getIntegritySymbol(fleet.integrity)}</span>
          </HoverTooltip>
        </div>}
      </div>
    )
  }

  private getIntegritySymbol(integrity: number) {
    if (integrity >= 0.75) {
      return ' '
    }
    if (integrity >= 0.5) {
      return '′'
    }
    if (integrity >= 0.25) {
      return '″'
    }
    return '‴'
  }

  private getCaptureTooltip(item: WorldBeingCaptured): string {
    return `Being captured by ${item.nextConvertingPlayerId}`
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

  getWorldTypeTooltip(worldType: WorldType): string | undefined {
    switch (worldType.type) {
      case 'CREEP': return 'World is/was defended by hostile entities';
      case 'POPULATED': return 'World is/was populated by friendly entities that can be captured';
      case 'DEFENSIVE': return 'Defending fleets get less damage at this world';
      case 'DOUBLE': return 'This world is comprised of two habitable planets and has double the resources.';
      case 'INDUSTRIAL': return 'Industry deployed to this world can build faster.';
      case 'INSPIRING': return 'Population at this world produces more influence';
      case 'LUSH': return 'Population at this world grows faster';
      case 'MINING': return 'This world has more metal and constantly produces metal when populated';
      case 'NEBULA': return 'Player cannot see into this world from neighboring worlds. Also there are no resources at this world';
      case 'VOID': return 'There are no planets here and hence no resources';
      case 'REGULAR': return 'Just a regular world';
    }
  }
}