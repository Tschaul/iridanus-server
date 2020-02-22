import * as React from "react";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import { OrderEditorViewModel } from "../../../view-model/game/order-editor-view-model";
import { Panel } from "../../../ui-components/panel/panel-component";
import { WorldOrder } from "../../../../shared/model/v1/world-order";
import { FleetOrder } from "../../../../shared/model/v1/fleet-orders";
import { Button } from "../../../ui-components/button/button";

@observer
export class OrderEditor extends React.Component<{
  vm: OrderEditorViewModel,
  style: React.CSSProperties;
}> {
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
        Fleet orders <br />
        ──────────────────────────────── <br />
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
        ──────────────────────────────── <br />
        <Button onClick={this.handleNewWarpOrder}>WARP</Button>
      </div>
    )
  }

  renderPanel(content: React.ReactElement) {
    return <Panel style={{ ...this.props.style }}>
      {content}
    </Panel>
  }

  @autobind
  handleNewWarpOrder() {
    this.props.vm.newWarpOrder()
  }

}