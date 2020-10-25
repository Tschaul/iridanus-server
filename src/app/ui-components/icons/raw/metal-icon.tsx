import React from "react";

export class MetalIcon extends React.Component<{
  posX: number,
  posY: number,
  size: number,
  color: string
}>  {

  render() {
    return <g>
      <rect
        x={this.props.posX}
        y={this.props.posY}
        width={this.props.size}
        height={this.props.size}
        fill={this.props.color}
      ></rect>
    </g>
  }
}