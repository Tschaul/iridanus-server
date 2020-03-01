import * as React from "react";
import { SelectedWorldViewModel } from "../../../view-model/game/selected-world-view-model";
import { Panel } from "../../../ui-components/panel/panel-component";
import { observer } from "mobx-react";
import { screenWhite, selectedYellow, hoverYellow } from "../../../ui-components/colors/colors";
import { Fleet } from "../../../../shared/model/v1/fleet";
import { World } from "../../../../shared/model/v1/world";
import { PlayerInfo } from "../../../../shared/model/v1/player-info";
import autobind from "autobind-decorator";
import { getClosestAttribute } from "../../helper/get-attribute";
import { reaction } from "mobx";
import * as classNames from 'classnames'
import { createClasses, StyleSheet } from "../../../ui-components/setup-jss";
import { PanelDivider } from "../../../ui-components/panel/panel-divider";

const classes = createClasses({
  row: {
    transition: "color 0.3s",
    cursor: 'pointer',
    color: screenWhite,
    "&.selected": {
      color: selectedYellow
    },
    "&:hover:not(.selected)": {
      color: hoverYellow
    }
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
        {this.props.vm.fleetsAtStageSelection.map(fleet => {
          return this.renderTableRow(fleet, false, fleet.owner);
        })}
      </div>
    )
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
    } else {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>{this.padSpaces(world.population)} P &nbsp;</div>
            <div>{this.padSpaces(world.industry)} I &nbsp;</div>
            <div>{this.padSpaces(world.mines)} M &nbsp;</div>
          </div>
          <PanelDivider></PanelDivider>
          {this.renderTableRow(world, true, this.props.vm.playerInfoOfSelectedWorld)}
        </div>
      )
    }
  }

  renderPanel(content: React.ReactElement) {
    return <Panel panelClassName={classNames(this.props.panelClassName)} ref={elem => this.panel = elem} fadeDirection="right">
      {content}
    </Panel>
  }

  renderTableRow(item: World | Fleet, isWorld: boolean, owner: PlayerInfo | null) {
    const selected = this.props.vm.isWorldOrFleetSelected(isWorld, item);
    const topIcon = selected ? '■' : '·';

    const color = owner ? owner.color : screenWhite;

    const icon = isWorld ? '◉' : '◈'

    return (
      <div className={classNames([classes.row, { selected }])} key={item.id} data-fleet-id={isWorld ? null : item.id} onClick={this.handleRowClick}>
        {topIcon} <span style={{ color, width: '1em', display: 'inline-block', textAlign: 'center' }}>{icon}</span> · {this.padSpaces(item.ships)} ► · {this.padSpaces(item.metal)} ▮ · {item.status}<br />
      </div>
    )
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
}