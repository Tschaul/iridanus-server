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
import { createClasses } from "../../../ui-components/setup-jss";

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
  style: React.CSSProperties;
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
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {this.padSpaces(world.population)} P  {this.padSpaces(world.industry)} I  {this.padSpaces(world.mines)} M  <br />
          ──────────────────────────────── <br />
          {this.renderTableRow(world, true, this.props.vm.playerInfoOfSelectedWorld)}
        </div>
      )
    }
  }

  renderPanel(content: React.ReactElement) {
    return <Panel panelStyle={{ ...this.props.style }} ref={elem => this.panel = elem} fadeDirection="right">
      {content}
    </Panel>
  }

  renderTableRow(item: World | Fleet, isWorld: boolean, owner: PlayerInfo | null) {
    const selected = this.props.vm.isWorldOrFleetSelected(isWorld, item);
    const topIcon = selected ? '■' : '·';

    const color = owner ? owner.color : screenWhite;

    const icon = isWorld ? '◉' : '◈'

    const style: React.CSSProperties = {
      color: selected ? selectedYellow : screenWhite
    }

    return (
      <div className={classNames([classes.row,{selected}])} key={item.id} data-fleet-id={isWorld ? null : item.id} onClick={this.handleRowClick}>
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