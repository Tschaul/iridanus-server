import * as React from "react";
import { WrappedObservable } from "../../screens/helper/wrap-observable";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";

@observer
export class InputString extends React.Component<{
  value: WrappedObservable<string>
}> {
  
  render() {
    return (
      <input value={this.props.value.get()} onChange={this.handleChange}/>
    )
  }

  @autobind
  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    this.props.value.set(value);
  }

}