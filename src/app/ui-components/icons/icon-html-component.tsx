import React from "react";
import { screenWhite } from "../colors/colors";
import { IconSvg, IconType } from "./icon-svg-component";

export class IconHtml extends React.Component<{
  size?: number,
  color?: string,
  type: IconType
}> {

  render() {
    const color = this.props.color ?? screenWhite;
    const sizeHtml = this.props.size ?? '1em';

    return <svg style={{
      display: 'inline',
      width: sizeHtml,
      height: sizeHtml,
      verticalAlign: 'sub'
    }} viewBox={`0 0 22 22`}>
      <IconSvg
        size={14}
        color={'inherit'}
        x={11}
        y={10}
        type={this.props.type}
      ></IconSvg>
    </svg>
  }

}