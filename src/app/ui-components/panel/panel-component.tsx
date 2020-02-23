import * as React from "react";
import { screenPseudoTransparent, screenWhite } from "../colors/colors";
import { animateElement } from "../animate-element";

export class Panel extends React.Component<{
  style?: React.CSSProperties,
  fadeDirection: 'top' | 'bottom' | 'left' | 'right'
}> {
  content: HTMLDivElement | null;
  panel: HTMLDivElement | null;

  getFadeInAnimationName() {
    return `fade-in-${this.props.fadeDirection}`
  }

  getFadeOutAnimationName() {
    return `fade-out-${this.props.fadeDirection}`
  }

  async refreshAnimation() {
    await animateElement(this.content, 'fade-in-screen');
  }

  async fadeOutAnimation() {
    await animateElement(this.panel, this.getFadeOutAnimationName());
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
      <div style={panelStyle} className={this.getFadeInAnimationName()} ref={elem => this.panel = elem}>
        <div ref={elem => this.content = elem}>
          {this.props.children}
        </div>
      </div>
    )
  }
}