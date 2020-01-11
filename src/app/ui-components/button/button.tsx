import * as React from "react";
import { screenPseudoTransparent, screenWhite } from "../colors/colors";

export class Button extends React.Component<{
  onClick?: () => void
}> {
  render() {

    const buttonStyle: React.CSSProperties = {
      color: 'rgba(114, 130, 135, 029)',
      backgroundColor: screenWhite,
      padding: '0.25em 0.5em',
      margin: '0.75em 0.5em',
      borderRadius: '0.5em',
      fontWeight: 'bold',
      boxShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 5px',
      textShadow: 'rgba(114, 130, 135, 029) 0px 0px 5px',
      cursor: 'pointer'
    }

    return(
      <div style={buttonStyle} onClick={this.props.onClick}>{this.props.children}</div>
    )
  }
}