import * as React from "react";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import { OrderEditorViewModel } from "../../../view-model/game/order-editor-view-model";
import { Panel } from "../../../ui-components/panel/panel-component";
import { WorldOrder } from "../../../../shared/model/v1/world-order";
import { FleetOrder } from "../../../../shared/model/v1/fleet-orders";
import { Button } from "../../../ui-components/button/button";
import { reaction } from "mobx";
import { PanelDivider } from "../../../ui-components/panel/panel-divider";
import { createClasses } from "../../../ui-components/setup-jss";
import classNames from "classnames";

const classes = createClasses({
  panel: {
    width: 500,
    height: 500,
    display: 'flex',
    flexDirection: 'column'
  }
});

@observer
export class OrderEditor extends React.Component<{
  vm: OrderEditorViewModel,
  panelClassName?: string,
}> {

  panel: Panel | null;

  componentDidMount() {
    reaction(
      () => [this.props.vm.selectionType, this.props.vm.selectedWorldOrFleetId],
      () => {
        if (this.panel) {
          this.panel.refreshAnimation();
        }
      }
    )
  }

  render() {
    switch (this.props.vm.selectionType) {
      case 'WORLD':
        return this.renderWorldOrderEditor(this.props.vm.orders as WorldOrder[])
      case 'FLEET':
        return this.renderFleetOrderEditor(this.props.vm.orders as FleetOrder[])
      default:
        return this.renderPanel(
          <span>nothing selected</span>
        )
    }
  }

  renderWorldOrderEditor(orders: WorldOrder[]) {

    return this.renderPanel(
      <div>
        World orders <br />
        ──────────────────────────────── <br />
        {orders.map(order => {
          switch (order.type) {
            case 'BUILD_INDUSTRY':
            case 'BUILD_SHIPS':
              return order.type;
          }
        })}
      </div>
    )
  }

  renderFleetOrderEditor(orders: FleetOrder[]) {

    return this.renderPanel(
      <div>
        <div>
          Fleet orders
          <PanelDivider></PanelDivider>
        </div>
        <div style={{ flex: 1 }}>
          {orders.map(order => {
            switch (order.type) {
              case 'TRANSFER_METAL':
                return `${order.type} (${order.amount}▮)`
              case 'TRANSFER_SHIPS':
                return `${order.type} (${order.amount}►)`
              case 'WAIT':
                return `${order.type} (${order.amountTime}ms)`
              case 'WARP':
                return `${order.type}`
            }
          }).map(str => <div>{str}</div>)}
        </div>
        <div style={{ display: 'flex' }}>
          <Button onClick={this.handleNewWarpOrder}>➠</Button>
        </div>
      </div>
    )
  }

  renderPanel(content: React.ReactElement) {
    return <Panel panelClassName={classNames(this.props.panelClassName)} contentClassName={classNames(classes.panel)} fadeDirection="right" ref={elem => this.panel = elem}>
      {content}
    </Panel>
  }

  @autobind
  handleNewWarpOrder() {
    this.props.vm.newWarpOrder()
  }

}