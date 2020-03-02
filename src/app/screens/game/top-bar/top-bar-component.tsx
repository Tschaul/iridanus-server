import * as React from "react";
import { OrderEditorViewModel } from "../../../view-model/game/order-editor-view-model";
import { Panel } from "../../../ui-components/panel/panel-component";
import classNames from "classnames";
import { Button } from "../../../ui-components/button/button";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { GameViewModel } from "../../../view-model/game/game-view-model";
import { GameOrders } from "../../../view-model/game/game-orders";

@observer
export class TopBar extends React.Component<{
  vm: GameOrders,
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
          disabled={this.props.vm.updatedOrdersCount === 0}
          style={{transform: 'translateY(-0.25em)'}}
          onClick={this.handleSaveOrders}
        >Save {this.props.vm.updatedOrdersCount} orders</Button>
      </div>
    </Panel>
  }

  @autobind
  public handleSaveOrders() {
    this.props.vm.saveOrderDrafts();
  }
}