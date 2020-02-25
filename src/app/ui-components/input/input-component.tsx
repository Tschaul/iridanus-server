import * as React from "react";
import { WrappedObservable } from "../../screens/helper/wrap-observable";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { createClasses } from "../setup-jss";
import classNames from "classnames";
import { selectedYellow } from "../colors/colors";

const classes = createClasses({
  input: {
    backgroundColor: "transparent",
    border: 0,
    color: "inherit",
    fontSize: "inherit",
    textShadow: "inherit",
    "&:focus": {
      color: selectedYellow
    }
  }
})

@observer
export class InputString extends React.Component<{
  value: WrappedObservable<string>,
  isPassword?: boolean,
  onEnterKey?: () => void
}> {
  
  render() {

    return (
      <input 
        type={this.props.isPassword ? "password" : "text"}
        className={classNames(classes.input)}
        value={this.props.value.get()} 
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    )
  }

  @autobind
  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    this.props.value.set(value);
  }

  @autobind
  handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if(event.keyCode === 13 && this.props.onEnterKey) {
      this.props.onEnterKey();
      event.defaultPrevented = true;
    }
  }


}