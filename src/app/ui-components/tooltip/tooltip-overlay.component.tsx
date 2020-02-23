import * as React from "react";
import autobind from "autobind-decorator";
import { screenWhite, screenPseudoTransparent, overlayBackground } from "../colors/colors";
import { ReplaySubject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { KeyExportOptions } from "crypto";

export interface TooltipContent {
  posX: number;
  posY: number;
  text: string | JSX.Element;
}

export class TooltipHandle {

  private items$$ = new ReplaySubject<TooltipContent[]>(1);

  public items$ = this.items$$.asObservable();

  private mousePosition$$ = new ReplaySubject<[number, number]>(1);
  private mouseItemText$$ = new ReplaySubject<string | JSX.Element | null>(1);

  public updateMousePosition(pageX: number, pageY: number) {
      this.mousePosition$$.next([pageX, pageY]);
  }

  public showMouseItem(text: string | JSX.Element) {
      this.mouseItemText$$.next(text);
  }

  public hideMouseItem() {
      this.mouseItemText$$.next(null);
  }

  public mouseItem$ = combineLatest([
    this.mouseItemText$$,
    this.mousePosition$$
  ]).pipe(
    map(([text, [posX, posY]]) => {
      if (text) {
        return {
          posX, posY, text
        }
      } else {
        return null;
      }
    })
  )
}

export const TooltipContext = React.createContext<TooltipHandle>(null as any);

export class TooltipOverlay extends React.Component<{}, {
  items: TooltipContent[],
  mouseItem: TooltipContent | null;
}> {

  private handle = new TooltipHandle();

  constructor(props: {}) {
    super(props);
    this.state = {
      items: [],
      mouseItem: null
    }


    this.handle.mouseItem$.subscribe(mouseItem => {
      this.setState({
        mouseItem
      })
    })

  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    // this.handle.showMouseItem('Hello World!');
    // this.handle.updateMousePosition(300, 300);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  render() {
    const tooltipOverlayStyle: React.CSSProperties = {
      zIndex: 4,
      position: 'fixed',
      opacity: 0.8,
      fontSize: '0.75em'
    }

    const tooltipStyle: React.CSSProperties = {
      position: 'fixed',
      color: screenWhite,
      backgroundColor: overlayBackground,
      margin: '1em',
      padding: '0.25em 0.5em',
      borderRadius: '0.25em',
      border: '1px solid '+ screenWhite
    }

    return [
      <div key="content">
        <TooltipContext.Provider value={this.handle}>
          {this.props.children}
        </TooltipContext.Provider>
      </div>,
      <div style={tooltipOverlayStyle} key="tooltip">
        {this.state.mouseItem && (
          <div className="fade-in-fast" style={{ ...tooltipStyle, top: this.state.mouseItem.posY, left: this.state.mouseItem.posX }}>{this.state.mouseItem.text}</div>
        )}
        {this.state.items.map((item, index) => {
          return <div key={index} style={{ ...tooltipStyle, top: item.posY, left: item.posX }}>{item.text}</div>
        })}
      </div>
    ]

  }

  @autobind
  handleMouseMove(event: MouseEvent) {
    this.handle.updateMousePosition(event.pageX, event.pageY);
  }

}
