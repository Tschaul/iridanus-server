import * as React from "react";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { WarpOrder, LoadMetalOrder, LoadShipsOrder } from "../../../../shared/model/v1/fleet-orders";

@observer
export class TransferOrderEditor extends React.Component<{
  order: LoadMetalOrder | LoadShipsOrder,
}>{
  render() {
    return (
      <div style={{display: 'flex'}}>
        <div>
          {this.props.order.type}
        </div>
        <div>
          &nbsp; ({Math.abs(this.props.order.amount)}{this.symbol()})
        </div>
        <div style={{flex: 1}}></div>
      </div>
    )
  }

  symbol() {
    
    if (this.props.order.type.indexOf('METAL') !== -1) {
      return '▮'
    } else {
      return '►'
    }
  }
}