import * as React from "react";
import { TooltipContext } from "./tooltip-overlay.component";
import autobind from "autobind-decorator";
import { Observable, Subscription } from "rxjs";

export class HoverTooltip extends React.Component<{
  svg?: boolean,
  content?: string,
  content$?: Observable<string>,
}> {
  static contextType = TooltipContext;
  declare context: React.ContextType<typeof TooltipContext>

  state: { content: string } = { content: this.props.content || '' }

  subscription: Subscription;

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

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
    } else if (this.props.content$) {
      this.subscription = this.props.content$.subscribe(content => {
        this.context.showMouseItem(content);
      })
    }
  }

  @autobind
  private handleMouseLeave() {
    this.context.hideMouseItem();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
