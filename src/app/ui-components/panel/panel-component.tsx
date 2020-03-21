import * as React from "react";
import { screenPseudoTransparent, screenWhite } from "../colors/colors";
import { animateElement } from "../animate-element";
import autobind from "autobind-decorator";
import classNames from "classnames";

export class Panel extends React.Component<{
  panelStyle?: React.CSSProperties,
  contentStyle?: React.CSSProperties,
  contentClassName?: string,
  panelClassName?: string,
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

  async fadeOut() {
    const start = new Date().getTime();
    await animateElement(this.panel, this.getFadeOutAnimationName());
    const end = new Date().getTime();
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
      userSelect: 'none'
    }

    return (
      <div style={panelStyle} className={classNames(this.getFadeInAnimationName(), this.props.panelClassName)} ref={elem => this.panel = elem}>
        <div className={classNames(this.props.contentClassName)} style={this.props.contentStyle} ref={elem => this.content = elem}>
          {this.props.children}
        </div>
      </div>
    )
  }
}