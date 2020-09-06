import React from "react";
import { screenPseudoTransparent, screenWhite } from "../colors/colors";
import { animateElement } from "../animate-element";
import classNames from "classnames";

export class Panel extends React.Component<{
  panelStyle?: React.CSSProperties,
  contentStyle?: React.CSSProperties,
  contentClassName?: string,
  panelClassName?: string,
  fadeDirection: 'top' | 'bottom' | 'left' | 'right',
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

  async fadeOut() {
    await animateElement(this.panel, this.getFadeOutAnimationName());
  }

  render() {

    const panelStyle: React.CSSProperties = {
      ...this.props.panelStyle || {},
      border: '2px solid ' + screenWhite,
      borderRadius: '0.5em',
      backgroundColor: screenPseudoTransparent,
      padding: 'calc(1em - 10px)',
      textShadow: 'rgba(255, 255, 255, 0.5) 0px 0px 5px',
      boxShadow: 'inset rgba(255, 255, 255, 0.5) 0px 0px 5px',
      margin: '0.25em',
      userSelect: 'none',
      display: 'flex',
      flexDirection: 'column'
    }

    return (
      <div style={panelStyle} className={classNames(this.getFadeInAnimationName(), this.props.panelClassName)} ref={elem => this.panel = elem}>
        <div ref={elem => this.content = elem} className={classNames(this.props.contentClassName)} style={this.props.contentStyle}>
          {this.props.children}
        </div>
      </div>
    )
  }

}
