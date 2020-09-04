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
import { HoverTooltip } from "../../../ui-components/tooltip/hover-tooltip.component";
import { Scroll } from "../../../ui-components/scroll-area/scroll-component";
import { AmountOrderEditor } from "./amount-oder-component";

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
    if (!this.props.vm.selectedWorldOrFleetIsVisibleToUser) {
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
      <div key="b" style={{ flex: 1 }}>
        {orders.map((order, index) => {
          switch (order.type) {
            case 'BUILD_INDUSTRY':
            case 'BUILD_SHIPS':
            case 'SCRAP_SHIPS_FOR_INDUSTRY':
              return <AmountOrderEditor order={order} index={index} update={this.handleOrderUpdate}></AmountOrderEditor>
          }
        }).map((content, index) => (
          <div key={index} data-order-index={index} style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>{content}</div>
            {!this.props.vm.selfIsSpectator && <div onClick={this.handleDelete} className={classNames(classes.deleteHandle)}>X</div>}
          </div>
        ))}
      </div>,
      ...(this.props.vm.selfIsSpectator ? [] : [(<div style={{ display: 'flex' }} key="c">
        <HoverTooltip content="Build industry"><Button tight onClick={this.handleNewBuildIndustryOrder} spaceRight>+I</Button></HoverTooltip>
        <HoverTooltip content="Build ships"><Button tight onClick={this.handleNewBuildShipsOrder} spaceRight>+►</Button></HoverTooltip>
        <HoverTooltip content="Scrap ships for industry"><Button tight onClick={this.handleNewScrapShipsOrder} spaceRight>⮂I</Button></HoverTooltip>
      </div>)])
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
      <div style={{ flex: "1 0 auto", height: "1em" }} key="b">
        <Scroll>
          {orders.map((order, index) => {
            switch (order.type) {
              case 'WARP':
                return <WarpOrderEditor order={order}></WarpOrderEditor>
              case 'AWAIT_CAPTURE':
                return <span>Await Capture</span>
            }
          }).map((content, index) => (
            <div key={index} {...mouseHandler} data-order-index={index} style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>{content}</div>
              {!this.props.vm.selfIsSpectator && <div onClick={this.handleDelete} className={classNames(classes.deleteHandle)}>X</div>}
            </div>
          ))}
        </Scroll>
      </div>,
      ...(this.props.vm.selfIsSpectator ? [] : [(<div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', marginTop: "0.5em" }} key="c">
        <HoverTooltip content="Warp to adjacent world"><Button tight onClick={this.handleNewWarpOrder}>➠</Button></HoverTooltip>
        <HoverTooltip content="Start cargo mission"><Button tight onClick={this.handleNewStartCargoMissionOrder}>⇄</Button></HoverTooltip>
        <HoverTooltip content="Await capture"><Button tight onClick={this.handleNewAwaitCaptureOrder}>⚑</Button></HoverTooltip>
      </div>)])
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
  handleNewStartCargoMissionOrder() {
    this.props.vm.newStartCargoMissionOrder()
  }

  @autobind
  handleNewAwaitCaptureOrder() {
    this.props.vm.newAwaitCaptureOrder()
  }

  @autobind
  handleNewBuildShipsOrder() {
    this.props.vm.newBuildShipsOrder(1)
  }

  @autobind
  handleNewBuildIndustryOrder() {
    this.props.vm.newBuildIndustryOrder(1)
  }

  @autobind
  handleNewScrapShipsOrder() {
    this.props.vm.newScrapShipsOrder(1)
  }

  @autobind
  handleOrderUpdate(order: FleetOrder | WorldOrder, index: number) {
    this.props.vm.updateOrder(order, index);
  }

}