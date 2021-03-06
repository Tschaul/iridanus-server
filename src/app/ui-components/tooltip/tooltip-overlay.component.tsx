import React from "react";
import autobind from "autobind-decorator";
import { screenWhite, screenPseudoTransparent, overlayBackground } from "../colors/colors";
import { ReplaySubject, combineLatest, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { KeyExportOptions } from "crypto";

export interface TooltipContent {
  posX: number;
  posY: number;
  text: string;
  id: string;
}

let id = 0;

export class TooltipHandle {

  private items$$ = new BehaviorSubject<TooltipContent[]>([]);

  public items$ = this.items$$.asObservable();

  private mousePosition$$ = new ReplaySubject<[number, number]>(1);
  private mouseItemText$$ = new ReplaySubject<string | null>(1);

  public updateMousePosition(pageX: number, pageY: number) {
    this.mousePosition$$.next([pageX, pageY]);
  }

  public showMouseItem(text: string) {
    this.mouseItemText$$.next(text);
  }

  public hideMouseItem() {
    this.mouseItemText$$.next(null);
  }

  public showStaticItem(posX: number, posY: number, text: string): string {
    const item: TooltipContent = {
      id: (id++) + '',
      posX,
      posY,
      text
    }

    const items = [...this.items$$.value, item]
    this.items$$.next(items);
    return item.id;
  }

  public removeStaticItem(id: string) {
    const items = this.items$$.value.filter(item => item.id !== id);
    this.items$$.next(items);
  }

  public mouseItem$ = combineLatest([
    this.mouseItemText$$,
    this.mousePosition$$
  ]).pipe(
    map(([text, [posX, posY]]) => {
      if (text) {
        return {
          posX, posY, text, id: 'mouse_item'
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
  }

  componentDidMount() {
    this.handle.mouseItem$.subscribe(mouseItem => {
      this.setState({
        mouseItem
      })
    })

    this.handle.items$.subscribe(items => {
      this.setState({
        items
      })
    })
    window.addEventListener('mousemove', this.handleMouseMove);
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

    return [
      <TooltipContext.Provider value={this.handle} key="content">
        {this.props.children}
      </TooltipContext.Provider>,
      <div style={tooltipOverlayStyle} key="tooltip">
        {this.state.mouseItem && (
          <TooltipItem key="a" item={this.state.mouseItem} />
        )}
        {this.state.items.map((item, index) => {
          return <TooltipItem key={index} item={item} />
        })}
      </div>
    ]

  }

  @autobind
  handleMouseMove(event: MouseEvent) {
    this.handle.updateMousePosition(event.pageX, event.pageY);
  }

}

class TooltipItem extends React.Component<{
  item: TooltipContent
}, {
  elemWidth: number;
  elemHeight: number;
  windowWidth: number;
  windowHeight: number;
}> {

  state = {
    elemWidth: 0,
    elemHeight: 0,
    windowWidth: 0,
    windowHeight: 0,
  }

  elem: HTMLDivElement | null;

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)
    if (this.elem) {
      this.handleElemResize();
    }
    this.handleWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  @autobind
  handleWindowResize() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    })
  }

  @autobind
  handleElemResize() {
    if (this.elem) {
      this.setState({
        elemWidth: this.elem.offsetWidth,
        elemHeight: this.elem.offsetHeight,
      })
    }
  }

  render() {

    const tooltipStyle: React.CSSProperties = {
      position: 'fixed',
      color: screenWhite,
      fill: screenWhite,
      backgroundColor: overlayBackground,
      margin: '1em',
      padding: '0.25em 0.5em',
      borderRadius: '0.25em',
      border: '1px solid ' + screenWhite
    }

    let { posX, posY } = this.props.item;

    if (posX + this.state.elemWidth - this.state.windowWidth > -32) {
      posX -= this.props.item.text.length * 12 + 16;
    }

    if (posY + this.state.elemHeight - this.state.windowHeight > -32) {
      posY -= 32;
    }

    return (
      <div ref={elem => this.elem = elem} className="fade-in-fast" style={{ ...tooltipStyle, top: posY, left: posX }}>{this.props.item.text}</div>
    )
  }
}
