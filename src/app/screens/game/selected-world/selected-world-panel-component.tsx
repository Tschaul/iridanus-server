import * as React from "react";
import { SelectedWorldViewModel } from "../../../view-model/game/selected-world-view-model";
import { Panel } from "../../../ui-components/panel/panel-component";
import { observer } from "mobx-react";
import { screenWhite } from "../../../ui-components/colors/colors";

@observer
export class SelectedWorldPanel extends React.Component<{
  vm: SelectedWorldViewModel,
  style: React.CSSProperties;
}> {
  render() {

    if (!this.props.vm.selectedWorld) {
      return this.renderPanel(
        <i>nothing selected</i>
      )
    }

    const world = this.props.vm.selectedWorld;

    const color = this.props.vm.playerInfoOfSelectedWorld ? this.props.vm.playerInfoOfSelectedWorld.color : screenWhite;

    return <Panel style={{ ...this.props.style }}>
      <span style={{ color }}>◉</span> &nbsp; &nbsp;  {this.padSpaces(world.ships)} ► · {this.padSpaces(world.population)} ▮ ·  {this.padSpaces(world.industry)} ⧫ ·  {this.padSpaces(world.mines)} ◣  <br />
      ───────────────────────────────
    </Panel>
  }

  renderPanel(content: React.ReactElement) {
    return <Panel style={{ ...this.props.style }}>
      {content}
    </Panel>
  }

  padSpaces(num: number) {
    if (num < 10) {
      return ' ' + num;
    } else {
      return '' + num;
    }
  }
}