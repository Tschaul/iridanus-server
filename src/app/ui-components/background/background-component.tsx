import autobind from "autobind-decorator";
import React from "react";
import { MainViewModel } from "../../view-model/main-view-model";
import { screenWhite } from "../colors/colors";
import { generateStar } from "./star-generator";

export class Background extends React.Component<{
  vm: MainViewModel
}> {
  canvas: HTMLCanvasElement | null;
  content: HTMLDivElement | null;

  componentDidMount() {

    this.setScreenDimensions();
    window.addEventListener('resize', this.setScreenDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setScreenDimensions);
  }

  @autobind
  private generateStars() {
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

  @autobind
  private setScreenDimensions() {
    if (this.content) {

      let width = Math.min(window.screen.availWidth, document.documentElement.clientWidth);
      let height = Math.min(window.screen.availHeight, document.documentElement.clientHeight);

      if(iOS()) {

        width = window.screen.availWidth;
        height = window.screen.availHeight;

        if (window.orientation === 90 && height > width) {
          width = window.screen.availHeight;
          height = window.screen.availWidth;
        }
  
        width = Math.min(width, document.documentElement.clientWidth);
        height = Math.min(height, document.documentElement.clientHeight);
      } 


      if (height < 1024) {
        this.props.vm.screenMode = 'SMALL'
      } else {
        this.props.vm.screenMode = 'LARGE'
      }

      this.props.vm.screenDimensions = [width, height];

      this.content.style.width = width + 'px';
      this.content.style.height = height + 'px';
      // alert('new screen dimensions: ' + width + ' ' + height  + ' ' + window.screen.availWidth  + ' ' + document.documentElement.clientWidth );
    }
    this.generateStars();
  }

  render() {

    const contentStyle: React.CSSProperties = {
      top: 0,
      left: 0,
      background: "linear-gradient(27deg, rgba(7,4,48,1) 0%, rgba(9,9,66,1) 35%, rgba(4,37,44,1) 100%)",
      backgroundSize: 'cover',
      overflow: 'hidden',
      position: 'absolute'
    }

    const backgroundStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      zIndex: 2,
      position: 'absolute'
    }

    const foregroundStyle: React.CSSProperties = {
      mixBlendMode: 'hard-light',
      zIndex: 3,
      color: screenWhite,
      width: '100%',
      height: '100%',
      position: 'absolute'
    }

    return <div ref={ref => this.content = ref} style={contentStyle}>
      <div style={backgroundStyle} key="background">
        <canvas style={{ height: "100%", width: "100%" }} ref={elem => this.canvas = elem}></canvas>
      </div>
      <div style={foregroundStyle} key="foreground">
        {this.props.children}
      </div>
    </div>
  }
}

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}