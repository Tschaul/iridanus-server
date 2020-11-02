import React from "react";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { WrappedObservable } from "../../helper/wrap-observable";
import { Input } from "../../../ui-components/input/input-component";

export type AmountOrderEditorOrder = {
  type: string,
  amount: number
};

export interface AmountOrderEditorProps {
  order: AmountOrderEditorOrder,
  index: number,
  update: (order: AmountOrderEditorOrder, index: number) => void
}

@observer
export class AmountOrderEditor extends React.Component<AmountOrderEditorProps, {
  lastGoodValue: number;
  value: number;
}>{

  constructor(props: AmountOrderEditorProps) {
    super(props);
    this.state = {
      lastGoodValue: props.order.amount,
      value: props.order.amount
    }
  }

  componentDidUpdate(props: AmountOrderEditorProps) {
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
      case 'BUILD_SHIPS':
      case 'BUILD_INDUSTRY':
      case 'SCRAP_SHIPS_FOR_INDUSTRY':
    }
  }

  displayText() {
    switch (this.props.order.type) {
      case 'SCRAP_SHIPS_FOR_INDUSTRY':
        return 'Scrap Ships';
      case 'BUILD_INDUSTRY':
        return 'Build Industry'
      case 'BUILD_SHIPS':
        return 'Build Ships'
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