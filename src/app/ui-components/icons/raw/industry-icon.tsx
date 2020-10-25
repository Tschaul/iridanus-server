import React from "react";
import { add, mul } from "../../../../shared/math/vec2";

const BAR_HEIGHT = 0.2;
const BAR_WIDTH = 0.2;
const WIDTH = 0.8;

export class IndustryIcon extends React.Component<{
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
    const x_plus = 0.5 + 0.5 * WIDTH;

    const d_plus = 0.5 + 0.5 * BAR_WIDTH;
    const d_minus = 0.5 - 0.5 * BAR_WIDTH;
    const h_plus = 1 - BAR_HEIGHT;
    const h_minus = BAR_HEIGHT;

    const raw = [
      { x: x_minus, y: 0 }, // 1 
      { x: x_plus, y: 0 }, // 2
      { x: x_plus, y: h_minus }, // 3
      { x: d_plus, y: h_minus }, // 4
      { x: d_plus, y: h_plus }, // 5
      { x: x_plus, y: h_plus }, // 6
      { x: x_plus, y: 1 }, // 7
      { x: x_minus, y: 1 }, // 8
      { x: x_minus, y: h_plus }, // 9
      { x: d_minus, y: h_plus }, // 10
      { x: d_minus, y: h_minus }, // 11
      { x: x_minus, y: h_minus }, // 12
    ]

    return 'M ' + raw.map(vec => {
      return add(mul(vec, this.props.size), { x: this.props.posX, y: this.props.posY })
    }).map(({ x, y }) => {
      return `${x} ${y}`
    }).join(' L ');
  }
}