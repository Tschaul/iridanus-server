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
export class Input extends React.Component<{
  value: WrappedObservable<string>,
  isPassword?: boolean,
  type: 'password' | 'text' | 'number',
  min?: number,
  max?: number,
  onEnterKey?: () => void,
  onBlur?: () => void,
  style?: React.CSSProperties
}> {

  render() {

    return (
      <input
        style={this.props.style}
        type={this.props.type}
        className={classNames(classes.input)}
        value={this.props.value.get()}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onBlur={this.props.onBlur}
        min={this.props.min}
        max={this.props.max}
        step={this.props.type === 'number' ? 1 : undefined}
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
    if (event.keyCode === 13 && this.props.onEnterKey) {
      this.props.onEnterKey();
      event.defaultPrevented = true;
    }
  }


}