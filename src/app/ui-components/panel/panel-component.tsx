import * as React from "react";
import { screenPseudoTransparent, screenWhite } from "../colors/colors";

export class Panel extends React.Component<{
  style?: React.CSSProperties
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
      margin: '0.5em'
    }

    return (
      <div style={panelStyle}>
        {this.props.children}
      </div>
    )
  }
}