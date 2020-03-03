import * as React from "react";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { WrappedObservable } from "../../helper/wrap-observable";
import { Input } from "../../../ui-components/input/input-component";
import { BuildIndustryOrder, BuildShipsOrder } from "../../../../shared/model/v1/world-order";

export interface BuildOrderEditorProps {
  order: BuildIndustryOrder | BuildShipsOrder,
  index: number,
  update: (order: BuildIndustryOrder | BuildShipsOrder, index: number) => void
}

@observer
export class BuildOrderEditor extends React.Component<BuildOrderEditorProps, {
  lastGoodValue: number;
  value: number;
}>{

  constructor(props: BuildOrderEditorProps) {
    super(props);
    this.state = {
      lastGoodValue: props.order.amount,
      value: props.order.amount
    }
  }

  componentDidUpdate(props: BuildOrderEditorProps) {
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
          {this.props.order.type}
        </div>
        <div>
          &nbsp; <Input onBlur={this.resetValue} style={{ width: '4ex' }} type="number" value={value} min={1} max={99} /> {this.symbol()}
        </div>
        <div style={{ flex: 1 }}></div>
      </div>
    )
  }

  symbol() {

    if (this.props.order.type.indexOf('INDUSTRY') !== -1) {
      return 'I'
    } else {
      return '►'
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