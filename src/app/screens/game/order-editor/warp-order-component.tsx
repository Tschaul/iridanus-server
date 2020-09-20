import React from "react";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { WarpOrder } from "../../../../shared/model/v1/fleet-orders";

@observer
export class WarpOrderEditor extends React.Component<{
  order: WarpOrder,
}>{
  render() {
    return (
      <div style={{display: 'flex'}}>
        <div>
          Warp
        </div>
        <div style={{flex: 1}}></div>
      </div>
    )
  }
}