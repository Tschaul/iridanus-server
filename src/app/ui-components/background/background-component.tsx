import * as React from "react";

export class Background extends React.Component {
  render() {

    const backgroundStyle: React.CSSProperties = {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: "url('assets/background/pexels-photo-1341279.jpeg')",
      backgroundSize: 'cover',
      zIndex: 2,
      position: 'fixed',
    }

    const foregroundStyle: React.CSSProperties = {
      zIndex: 3,
      color: 'white',
      width: '100%',
      height: '100%',
      position: 'absolute',
    }

    return [
      <div style={backgroundStyle} key="background"></div>,
      <div style={foregroundStyle}>
        {this.props.children}
      </div>
    ]
  }
}