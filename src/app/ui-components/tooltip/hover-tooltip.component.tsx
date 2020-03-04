import * as React from "react";
import { TooltipContext } from "./tooltip-overlay.component";
import autobind from "autobind-decorator";

export class HoverTooltip extends React.Component<{
  svg?: boolean,
  content: string | JSX.Element,
}> {
  static contextType = TooltipContext;
  declare context: React.ContextType<typeof TooltipContext>

  render() {

    const mouseHandler = {
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave
    }

    if (!this.props.svg) {
      return (
        <div
          {...mouseHandler}
        >{this.props.children}</div>
      )
    }
    return (
      <g
        {...mouseHandler}
      >{this.props.children}</g>
    )
  }

  @autobind
  private handleMouseEnter() {
    if (this.props.content) {
      this.context.showMouseItem(this.props.content);
    }
  }

  @autobind
  private handleMouseLeave() {
    this.context.hideMouseItem();
  }
}
