import * as React from "react";
import { screenWhite } from "../colors/colors";
import { generateStar } from "./star-generator";

export class Background extends React.Component {
  canvas: HTMLCanvasElement | null;

  componentDidMount() {
    if (this.canvas) {
      const canvas = this.canvas;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      var context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
      Array.from(Array(1000).keys()).forEach(() => {
        generateStar(canvas, context, 2.5);
      })
    }
  }

  render() {

    const backgroundStyle: React.CSSProperties = {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      // backgroundImage: "url('assets/background/pexels-photo-1341279.jpeg')",
      // backgroundColor: "darkblue",
      background: "linear-gradient(27deg, rgba(7,4,48,1) 0%, rgba(9,9,66,1) 35%, rgba(4,37,44,1) 100%)",
      backgroundSize: 'cover',
      zIndex: 2,
      position: 'fixed',
    }

    const foregroundStyle: React.CSSProperties = {
      mixBlendMode: 'hard-light',
      zIndex: 3,
      color: screenWhite,
      width: '100%',
      height: '100%',
      position: 'absolute',
    }

    return [
      <div style={backgroundStyle} key="background">
        <canvas style={{ height: "100vh", width: "100vw" }} ref={elem => this.canvas = elem}></canvas>
      </div>,
      <div style={foregroundStyle} key="foreground">
        {this.props.children}
      </div>
    ]
  }
}