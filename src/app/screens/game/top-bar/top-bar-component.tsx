import * as React from "react";
import { OrderEditorViewModel } from "../../../view-model/game/order-editor-view-model";
import { Panel } from "../../../ui-components/panel/panel-component";
import classNames from "classnames";
import { Button } from "../../../ui-components/button/button";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { TopBarViewModel } from "../../../view-model/game/top-bar-view-model";
import { createClasses } from "../../../ui-components/setup-jss";
import { getClosestAttribute } from "../../helper/get-attribute";
import { StatType } from "../../../view-model/game/game-stats";
import { hoverYellow } from "../../../ui-components/colors/colors";

const classes = createClasses({
  statsItem: {
    transition: 'color 0.3s',
    marginLeft: '1em',
    "&:hover": {
      color: hoverYellow
    }
  }
})

@observer
export class TopBar extends React.Component<{
  vm: TopBarViewModel,
  panelClassName?: string,
}> {
  render() {

    const stats = this.props.vm.totalStats;

    const mouseHandler = {
      onMouseEnter: this.handleMouseEnterStatsItem,
      onMouseLeave: this.handleMouseLeaveStatsItem
    }

    return <Panel
      panelClassName={classNames(this.props.panelClassName)}
      fadeDirection="left"
      contentStyle={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <div>
        <Button
          disabled={this.props.vm.updatedOrdersCount === 0}
          style={{ transform: 'translateY(-0.25em)' }}
          onClick={this.handleSaveOrders}
        >Save {this.props.vm.updatedOrdersCount} orders</Button>
      </div>
      <div>
        <span {...mouseHandler} data-stat={'POPULATION'} className={classNames(classes.statsItem)}>{stats.population} P </span>
        <span {...mouseHandler} data-stat={'INDUSTRY'} className={classNames(classes.statsItem)}>{stats.industry} I</span>
        <span {...mouseHandler} data-stat={'MINES'} className={classNames(classes.statsItem)}>{stats.mines} M</span>
        <span {...mouseHandler} data-stat={'METAL'} className={classNames(classes.statsItem)}>{stats.metal} ▮</span>
        <span {...mouseHandler} data-stat={'SHIPS'} className={classNames(classes.statsItem)}>{stats.ships} ►</span>
        <span {...mouseHandler} data-stat={'FLEET_KEYS'} className={classNames(classes.statsItem)}>{stats.fleetKeys} ◈</span>
      </div>
      <div>
        {this.props.vm.gameId}
      </div>
    </Panel>
  }

  @autobind
  public handleSaveOrders() {
    this.props.vm.saveOrderDrafts();
  }

  @autobind
  private handleMouseEnterStatsItem(event: React.MouseEvent<HTMLDivElement>) {
    const statType = getClosestAttribute(event, 'data-stat') as StatType;
    this.props.vm.highlightStat(statType)
  }

  @autobind
  private handleMouseLeaveStatsItem() {
    this.props.vm.highlightStat('NONE');
  }
}