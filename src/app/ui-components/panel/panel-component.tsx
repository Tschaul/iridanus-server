import * as React from "react";
import { screenPseudoTransparent, screenWhite } from "../colors/colors";
import { resolve } from "dns";

export class Panel extends React.Component<{
  style?: React.CSSProperties,
}> {
  content: HTMLDivElement | null;
  panel: HTMLDivElement | null;

  refreshAnimation() {
    return new Promise((resolve) => {
      if (this.content) {
        this.content.classList.add('fade-in-screen')
        const removeAnimationClass = () => {
          if (this.content) {
            this.content.classList.remove('fade-in-screen')
            this.content.removeEventListener('animationend', removeAnimationClass);
          }
          resolve();
        }
        this.content.addEventListener('animationend', removeAnimationClass)
      }
      resolve();
    })
  }

  fadeOutAnimation() {
    return new Promise((resolve) => {
      if (this.panel) {
        this.panel.classList.add('fade-out-top')
        const removeAnimationClass = () => {
          if (this.panel) {
            this.panel.classList.remove('fade-out-top')
            this.panel.removeEventListener('animationend', removeAnimationClass);
          }
          resolve();
        }
        this.panel.addEventListener('animationend', removeAnimationClass)
      } else {
        resolve();
      }
    })
  }

  render() {

    const panelStyle: React.CSSProperties = {
      ...this.props.style || {},
      border: '2px solid ' + screenWhite,
      borderRadius: '0.5em',
      backgroundColor: screenPseudoTransparent,
      padding: 'calc(1em - 10px)',
      textShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 5px',
      boxShadow: 'inset rgba(255, 255, 255, 0.5) 0px 0px 5px',
      margin: '0.5em',
      userSelect: 'none'
    }

    return (
      <div style={panelStyle} className="fade-in-top" ref={elem => this.panel = elem}>
        <div ref={elem => this.content = elem}>
          {this.props.children}
        </div>
      </div>
    )
  }
}