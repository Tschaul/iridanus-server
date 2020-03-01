import * as React from "react";
import { OrderEditorViewModel } from "../../../view-model/game/order-editor-view-model";
import { Panel } from "../../../ui-components/panel/panel-component";
import classNames from "classnames";
import { Button } from "../../../ui-components/button/button";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";

@observer
export class TopBar extends React.Component<{
  orderEditorVm: OrderEditorViewModel,
  panelClassName?: string,
}> {
  render() {
    return <Panel 
      panelClassName={classNames(this.props.panelClassName)} 
      fadeDirection="left" 
      contentStyle={{display: 'flex'}}
      >
      <div>
        <Button
          disabled={this.props.orderEditorVm.updatedOrdersCount === 0}
          style={{transform: 'translateY(-0.25em)'}}
          onClick={this.handleSaveOrders}
        >Save {this.props.orderEditorVm.updatedOrdersCount} orders</Button>
      </div>
    </Panel>
  }

  @autobind
  public handleSaveOrders() {
    this.props.orderEditorVm.saveOrderDrafts();
  }
}