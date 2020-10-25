import React from "react";
import { IconComponent } from "./icon-component-base";

export class PopulationIcon extends React.Component<{
  posX: number,
  posY: number,
  size: number,
  color: string
}>  {

  render() {
    const r = 0.5 * this.props.size;
    return <g>
      <circle
        cx={this.props.posX + r}
        cy={this.props.posY + r}
        r={r}
        fill={this.props.color}
      ></circle>
    </g>
  }
}