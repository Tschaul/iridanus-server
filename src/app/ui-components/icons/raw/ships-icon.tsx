import React from "react";
import { add, mul } from "../../../../shared/math/vec2";

const HEIGHT = 0.8;
const WIDTH = 0.8;

export class ShipsIcon extends React.Component<{
  posX: number,
  posY: number,
  size: number,
  color: string
}>  {

  render() {
    return <g>
      <path
        d={this.path()}
        fill={this.props.color}
      >
      </path>
    </g>
  }

  path() {
    const raw = [
      { x: 0, y: 0 }, // 1 
      { x: 1, y: 0.5 }, // 2 
      { x: 0, y: 1 }, // 3 
    ]

    return 'M ' + raw.map(vec => {
      return add(mul(vec, this.props.size), { x: this.props.posX, y: this.props.posY })
    }).map(({ x, y }) => {
      return `${x} ${y}`
    }).join(' L ');
  }
}