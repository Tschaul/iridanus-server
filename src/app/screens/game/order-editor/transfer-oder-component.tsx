import * as React from "react";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { LoadMetalOrder, LoadShipsOrder, DropMetalOrder, DropShipsOrder, ScrapShipsForIndustryOrder } from "../../../../shared/model/v1/fleet-orders";
import { WrappedObservable } from "../../helper/wrap-observable";
import { Input } from "../../../ui-components/input/input-component";

export type TransferOrderEditorOrder = LoadMetalOrder | LoadShipsOrder | DropMetalOrder | DropShipsOrder | ScrapShipsForIndustryOrder;

export interface TransferOrderEditorProps {
  order: TransferOrderEditorOrder,
  index: number,
  update: (order: TransferOrderEditorOrder, index: number) => void
}

@observer
export class TransferOrderEditor extends React.Component<TransferOrderEditorProps, {
  lastGoodValue: number;
  value: number;
}>{

  constructor(props: TransferOrderEditorProps) {
    super(props);
    this.state = {
      lastGoodValue: props.order.amount,
      value: props.order.amount
    }
  }

  componentDidUpdate(props: TransferOrderEditorProps) {
    if (this.state.value !== props.order.amount) {
      this.setState({
        lastGoodValue: props.order.amount,
        value: props.order.amount
      });
    }
  }

  render() {

    const value: WrappedObservable<string> = {
      get: () => {
        return this.state.value + '';
      },
      set: (value) => {
        this.handleAmountUpdate(value);
      }
    }

    return (
      <div style={{ display: 'flex' }}>
        <div>
          {this.displayText()}
        </div>
        <div>
          &nbsp; <Input onBlur={this.resetValue} style={{ width: '4ex' }} type="number" value={value} min={1} max={99} /> {this.symbol()}
        </div>
        <div style={{ flex: 1 }}></div>
      </div>
    )
  }

  symbol() {
    switch (this.props.order.type) {
      case 'DROP_METAL':
      case 'LOAD_METAL':
        return '▮';
      case 'DROP_SHIPS':
      case 'LOAD_SHIPS':
        return '►';
      case 'SCRAP_SHIPS_FOR_INDUSTRY':
        return 'I';
    }
  }

  displayText() {
    switch (this.props.order.type) {
      case 'DROP_METAL':
        return 'Drop Metal';
      case 'LOAD_METAL':
        return 'Load Metal';
      case 'DROP_SHIPS':
        return 'Drop Ships';
      case 'LOAD_SHIPS':
        return 'Load Ships';
      case 'SCRAP_SHIPS_FOR_INDUSTRY':
        return 'Scrap Ships';
    }
  }

  @autobind
  handleAmountUpdate(valueString: string) {

    const value = parseInt(valueString);

    this.setState({ value })

    if (!isNaN(value) && value && value >= 1 && value <= 99) {
      this.setState({
        lastGoodValue: value
      })
      this.props.update({
        ...this.props.order,
        amount: value
      }, this.props.index)
    }
  }

  @autobind
  resetValue() {
    this.setState({
      value: this.state.lastGoodValue
    })
  }
}