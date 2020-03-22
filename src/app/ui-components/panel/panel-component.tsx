import * as React from "react";
import { screenPseudoTransparent, screenWhite } from "../colors/colors";
import { animateElement } from "../animate-element";
import autobind from "autobind-decorator";
import classNames from "classnames";
import ScrollArea from 'react-scrollbar';

export class Panel extends React.Component<{
  panelStyle?: React.CSSProperties,
  contentStyle?: React.CSSProperties,
  contentClassName?: string,
  panelClassName?: string,
  fadeDirection: 'top' | 'bottom' | 'left' | 'right',
  disableScrolling?: boolean
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
      userSelect: 'none',
      display: 'flex',
      flexDirection: 'column'
    }

    return (
      <div style={panelStyle} className={classNames(this.getFadeInAnimationName(), this.props.panelClassName)} ref={elem => this.panel = elem}>
        {this.renderScrollAreaOrNot(
          <div ref={elem => this.content = elem} className={classNames(this.props.contentClassName)} style={this.props.contentStyle}>
            {this.props.children}
          </div>
        )}
      </div>
    )
  }

  private renderScrollAreaOrNot(content: any) {
    if (this.props.disableScrolling) {
      return content
    } else {
      return <ScrollArea
        smoothScrolling={true}
        verticalScrollbarStyle={{
          backgroundColor: screenWhite,
          borderRadius: '0.25ex'
        }}
      >
        {content}
      </ScrollArea>
    }
  }
}

// <div className={classNames(this.props.contentClassName)} style={this.props.contentStyle} ref={elem => this.content = elem}>
//