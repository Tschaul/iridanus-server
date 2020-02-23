import * as React from "react";
import { screenPseudoTransparent, screenWhite } from "../colors/colors";

export class Panel extends React.Component<{
  style?: React.CSSProperties,
  className?: string,
  panelRef?: (elem: HTMLDivElement | null) => void,
}> {
  render() {

    const panelStyle: React.CSSProperties = {
      ...this.props.style || {},
      border: '2px solid '+screenWhite,
      borderRadius: '0.5em',
      backgroundColor: screenPseudoTransparent,
      padding: 'calc(1em - 10px)',
      textShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 5px',
      boxShadow: 'inset rgba(255, 255, 255, 0.5) 0px 0px 5px',
      margin: '0.5em',
      userSelect: 'none'
    }

    return (
      <div style={panelStyle} className={this.props.className} ref={this.props.panelRef}> 
        {this.props.children}
      </div>
    )
  }
}