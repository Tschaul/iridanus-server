import * as React from "react";

export class Panel extends React.Component<{
  style?: React.CSSProperties
}> {
  render() {

    const panelStyle: React.CSSProperties = {
      ...this.props.style || {},
      border: '2px solid white',
      borderRadius: '0.5em',
      backgroundColor: 'rgba(128, 151, 158, 0.29)',
      padding: 'calc(1em - 10px)',
      textShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 5px',
      boxShadow: 'inset rgba(255, 255, 255, 0.5) 0px 0px 5px'
    }

    return (
      <div style={panelStyle}>
        {this.props.children}
      </div>
    )
  }
}