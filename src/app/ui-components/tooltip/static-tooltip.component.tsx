import React from "react";
import { TooltipContext } from "./tooltip-overlay.component";

export class StaticTooltip extends React.Component<{
  svg?: boolean,
  content: any,
}> {
  static contextType = TooltipContext;
  declare context: React.ContextType<typeof TooltipContext>
  elem: SVGElement | HTMLDivElement | null;
  id: string | null = null;

  render() {

    if (!this.props.svg) {
      return (
        <div ref={elem => this.elem = elem}
        >{this.props.children}</div>
      )
    }
    return (
      <g ref={elem => this.elem = elem}
      >{this.props.children}</g>
    )
  }

  componentDidUpdate() {
    if (this.id) {
      this.context.removeStaticItem(this.id);
    }
    if (this.elem && this.props.content) {
      const { top, left } = this.elem.getBoundingClientRect();
      this.id = this.context.showStaticItem(left, top, this.props.content)
    }
  }

  componentDidMount() {
    if (this.elem && this.props.content) {
      const { top, left } = this.elem.getBoundingClientRect();
      this.id = this.context.showStaticItem(left, top, this.props.content)
    }
  }

  componentWillUnmount() {
    if (this.id) {
      this.context.removeStaticItem(this.id);
    }
  }

}
