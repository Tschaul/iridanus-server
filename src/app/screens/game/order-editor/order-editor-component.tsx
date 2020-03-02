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
import { getClosestAttribute } from "../../helper/get-attribute";
import { WarpOrderEditor } from "./warp-order-component";
import { hoverYellow } from "../../../ui-components/colors/colors";
import { TransferOrderEditor } from "./transfer-oder-component";

const classes = createClasses({
  panel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  deleteHandle: {
    transition: 'color 0.3s',
    cursor: 'pointer',
    "&:hover": {
      color: hoverYellow
    }
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
    if (!this.props.vm.selectedWorldOrFleetIsOwnedByUser) {
      return this.renderPanel([<span>not yours</span>])
    }
    switch (this.props.vm.selectionType) {
      case 'WORLD':
        return this.renderWorldOrderEditor(this.props.vm.orders as WorldOrder[])
      case 'FLEET':
        return this.renderFleetOrderEditor(this.props.vm.orders as FleetOrder[])
      default:
        return this.renderPanel([<span key="a">nothing selected</span>])
    }
  }

  renderWorldOrderEditor(orders: WorldOrder[]) {

    return this.renderPanel([
      <div key="a">
        World orders
          <PanelDivider></PanelDivider>
      </div>,
      <div key="b">
        {orders.map(order => {
          switch (order.type) {
            case 'BUILD_INDUSTRY':
            case 'BUILD_SHIPS':
              return order.type;
          }
        })}
      </div>
    ])
  }

  renderFleetOrderEditor(orders: FleetOrder[]) {

    const mouseHandler = {
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave
    }
    return this.renderPanel([
      <div key="a">
        Fleet orders
          <PanelDivider></PanelDivider>
      </div>,
      <div style={{ flex: 1 }} key="b">
        {orders.map((order, index) => {
          switch (order.type) {
            case 'LOAD_METAL':
            case 'LOAD_SHIPS':
            case 'DROP_SHIPS':
            case 'DROP_METAL':
              return <TransferOrderEditor order={order}></TransferOrderEditor>
            case 'WAIT':
              return `${order.type} (${order.amountTime}ms)`
            case 'WARP':
              return <WarpOrderEditor order={order}></WarpOrderEditor>
          }
        }).map((content, index) => (
          <div key={index} {...mouseHandler} data-order-index={index} style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>{content}</div>
            <div onClick={this.handleDelete} className={classNames(classes.deleteHandle)}>X</div>
          </div>
        ))}
      </div>,
      <div style={{ display: 'flex' }} key="c">
        <Button onClick={this.handleNewDropMetalOrder} spaceRight>🠣▮</Button>
        <Button onClick={this.handleNewLoadMetalOrder} spaceRight>🠡▮</Button>
        <Button onClick={this.handleNewDropShipsOrder} spaceRight>🠣►</Button>
        <Button onClick={this.handleNewLoadShipsOrder} spaceRight>🠡►</Button>
        <Button onClick={this.handleNewWarpOrder}>➠</Button>
      </div>
    ])
  }

  @autobind
  private handleMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
    const index = parseInt(getClosestAttribute(event, 'data-order-index') || '')
    if (!isNaN(index)) {
      const order = this.props.vm.orders[index]
      this.props.vm.showHintsForOrder(order);
    }
  }

  @autobind
  private handleMouseLeave() {
    this.props.vm.clearHints();
  }

  @autobind
  private handleDelete(event: React.MouseEvent<HTMLDivElement>) {
    const index = parseInt(getClosestAttribute(event, 'data-order-index') || '')
    this.props.vm.deleteOrder(index);
  }

  renderPanel(content: React.ReactElement[]) {
    return <Panel panelClassName={classNames(this.props.panelClassName)} contentClassName={classNames(classes.panel)} fadeDirection="right" ref={elem => this.panel = elem}>
      {content}
    </Panel>
  }

  @autobind
  handleNewWarpOrder() {
    this.props.vm.newWarpOrder()
  }

  @autobind
  handleNewLoadMetalOrder() {
    this.props.vm.newLoadMetalOrder(99)
  }

  @autobind
  handleNewDropMetalOrder() {
    this.props.vm.newDropMetalOrder(99)
  }

  @autobind
  handleNewLoadShipsOrder() {
    this.props.vm.newLoadShipsOrder(99)
  }

  @autobind
  handleNewDropShipsOrder() {
    this.props.vm.newDropShipsOrder(99)
  }

}