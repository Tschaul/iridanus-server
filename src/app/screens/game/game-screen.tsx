import React from "react";
import { GameStage } from "./game-stage/game-stage-component";
import { GameViewModel } from "../../view-model/game/game-view-model";
import { SelectedWorldPanel } from "./selected-world/selected-world-panel-component";
import { OrderEditor } from "./order-editor/order-editor-component";
import { HasExitAnimation } from "../../ui-components/animatable-components";
import classNames from "classnames";
import { createClasses } from "../../ui-components/setup-jss";
import { TopBar } from "./top-bar/top-bar-component";
import { GameInfoPanel } from "./game-info/game-info-panel";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import { Panel } from "../../ui-components/panel/panel-component";
import { Button } from "../../ui-components/button/button";

const TOP_BAR_HEIGHT = 65;
const RIGHT_PANEL_WIDTH = 400;

const MIDDLE_PANEL_HEIGHT = 300;
const BOTTOM_PANEL_HEIGHT = 300;
const TOP_PANEL_HEIGHT = 300;

const classes = createClasses({
  grid: {
    display: 'grid',
    height: '100%',
    width: '100%',
    gridTemplateColumns: `[start] auto [panels-start] ${RIGHT_PANEL_WIDTH}px [end]`,
    gridTemplateRows: `[start] ${TOP_BAR_HEIGHT}px [main-start] auto [top-start] ${TOP_PANEL_HEIGHT}px [middle-start] ${MIDDLE_PANEL_HEIGHT}px [bottom-start] ${BOTTOM_PANEL_HEIGHT}px [end]`,
    position: 'absolute',
    top: 0,
    left: 0
  },
  topLeft: {
    gridColumn: 'start / panels-start',
    gridRow: 'start / main-start',
  },
  topRight: {
    gridColumn: 'panels-start / end',
    gridRow: 'top-start / middle-start',
  },
  middleRight: {
    gridColumn: 'panels-start / end',
    gridRow: 'middle-start / bottom-start',
  },
  bottomRight: {
    gridColumn: 'panels-start / end',
    gridRow: 'bottom-start / end',
  },
  gameStage: {
    gridColumn: 'start / panels-start',
    gridRow: 'main-start / end',
    overflow: 'hidden'
  }
});

@observer
export class GameScreen extends React.Component<{ vm: GameViewModel }, { menuIsOpen: boolean }> implements HasExitAnimation {

  state = {
    menuIsOpen: true
  }

  pinchzoom: HTMLDivElement | null;
  panel: Panel | null;

  async fadeOut() {
    if (this.panel) {
      await this.panel.fadeOut();
    }
  }

  componentDidMount() {
    this.props.vm.focus();
  }

  componentWillUnmount() {
    this.props.vm.unfocus();
  }

  render() {
    switch (this.props.vm.playerStatus) {
      case 'DEFEATED':
        return this.renderPanel(false);
      case 'VICTORIOUS':
        return this.renderPanel(true);
      case 'SPECTATING':
      case 'PLAYING':
      default:
        return this.renderGame();
    }
  }

  renderPanel(won: boolean) {

    const container: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%'
    }

    const panelContentStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'stretch',
      flexDirection: 'column'
    }

    const panelStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: 500,
      height: 250
    }

    const text = won
      ? `YOU ARE VICTORIOUS`
      : `YOU WERE DEFEATED`

    return (
      <div style={container}>
        <Panel panelStyle={panelStyle} contentStyle={panelContentStyle} ref={elem => this.panel = elem} fadeDirection="top">
          <div style={{ flex: 1 }}>
            {text}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button onClick={this.handleBackToLobby}>BACK TO LOBBY</Button>
            </div>
          </div>
        </Panel>
      </div>
    )
  }

  @autobind
  private handleBackToLobby() {
    this.props.vm.backToLobby();
  }

  renderGame() {

    switch (this.props.vm.screenMode) {
      case 'NONE':
        return <span />;
      case 'SMALL':
        const [width, height] = this.props.vm.screenDimensions;
        return [<div style={{ width: '100%', height: '100%' }}>
          <TransformWrapper
            defaultScale={1}
          >
            <TransformComponent>
              <div style={{ width: width, height: height }}>
                <GameStage
                  className={classNames(classes.gameStage)}
                  vm={this.props.vm.gameStageViewModel} />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>,
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 0 }}>
          <div style={{ display: 'flex' }}>
            <TopBar
              vm={this.props.vm.topBarViewModel}
              onToggleBurgerButton={this.handleToggleMenu}
            />
          </div>

          <div style={{
            transform: `translateX(${this.state.menuIsOpen ? 0 : width}px)`,
            transition: 'transform 400ms',
            position: 'relative',
            height: height - 70,
            overflowY: 'scroll',
            overflowX: 'visible'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              <GameInfoPanel
                vm={this.props.vm.infoPanelViewModel}
              />
              <SelectedWorldPanel
                vm={this.props.vm.selectedWorldViewModel}
              />
              <OrderEditor
                vm={this.props.vm.orderEditorViewModel}
              />
            </div>
          </div>
        </div>]
      case 'LARGE':

        return (
          <div className={classNames(classes.grid)}>
            <TopBar
              vm={this.props.vm.topBarViewModel}
              panelClassName={classNames(classes.topLeft)}
            />
            <GameInfoPanel
              vm={this.props.vm.infoPanelViewModel}
              panelClassName={classNames(classes.topRight)}
            />
            <SelectedWorldPanel
              vm={this.props.vm.selectedWorldViewModel}
              panelClassName={classNames(classes.middleRight)}
            />
            <OrderEditor
              vm={this.props.vm.orderEditorViewModel}
              panelClassName={classNames(classes.bottomRight)}
            />
            <GameStage
              className={classNames(classes.gameStage)}
              vm={this.props.vm.gameStageViewModel} />
          </div>
        )
    }
  }

  @autobind
  private handleToggleMenu() {
    this.setState({
      menuIsOpen: !this.state.menuIsOpen
    })
  }
}