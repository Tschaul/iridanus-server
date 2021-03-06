import React from "react";
import { add, mul } from "../../../../shared/math/vec2";

const HEIGHT = 0.7;
const WIDTH = 0.9;

export class HomeIcon extends React.Component<{
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
    
    const x_minus = 0.5 - 0.5 * WIDTH;
    const x_middle = 0.5;
    const x_plus = 0.5 + 0.5 * WIDTH;

    const y_full = 0;
    const y_minus = 1 - HEIGHT;
    const y_plus = 1;

    const raw = [
      { x: x_minus, y: y_minus }, // 1 
      { x: x_middle, y: y_full }, // 2 
      { x: x_plus, y: y_minus }, // 3 
      { x: x_plus, y: y_plus }, // 4 
      { x: x_minus, y: y_plus }, // 6 
    ]

    return 'M ' + raw.map(vec => {
      return add(mul(vec, this.props.size), { x: this.props.posX, y: this.props.posY })
    }).map(({ x, y }) => {
      return `${x} ${y}`
    }).join(' L ');
  }
}