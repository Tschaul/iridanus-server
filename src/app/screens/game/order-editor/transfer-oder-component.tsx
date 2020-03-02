import * as React from "react";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { WarpOrder, TransferMetalOrder, TransferShipsOrder } from "../../../../shared/model/v1/fleet-orders";

@observer
export class TransferOrderEditor extends React.Component<{
  order: TransferMetalOrder | TransferShipsOrder,
}>{
  render() {
    return (
      <div style={{display: 'flex'}}>
        <div>
          {this.displayText()}
        </div>
        <div>
          &nbsp; ({Math.abs(this.props.order.amount)}{this.symbol()})
        </div>
        <div style={{flex: 1}}></div>
      </div>
    )
  }

  displayText() {
    let result = '';
    if (this.props.order.amount > 0) {
      result += 'LOAD '
    } else {
      result += 'DROP '
    }
    if (this.props.order.type === 'TRANSFER_METAL') {
      result += 'METAL'
    } else {
      result += 'SHIPS'
    }
    return result;
  }

  symbol() {
    
    if (this.props.order.type === 'TRANSFER_METAL') {
      return '▮'
    } else {
      return '►'
    }
  }
}