import React from "react";
import { Panel } from "../../ui-components/panel/panel-component";
import { GameStage } from "./game-stage/game-stage-component";
import { GameViewModel } from "../../view-model/game/game-view-model";
import { SelectedWorldPanel } from "./selected-world/selected-world-panel-component";
import { OrderEditor } from "./order-editor/order-editor-component";
import { HasExitAnimation } from "../../ui-components/animatable-components";
import classNames from "classnames";
import { createClasses } from "../../ui-components/setup-jss";
import { TopBar } from "./top-bar/top-bar-component";
import { GameInfoPanel } from "./game-info/game-info-panel";

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
    position: 'fixed',
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

export class GameScreen extends React.Component<{ vm: GameViewModel }> implements HasExitAnimation {

  async fadeOut() { }

  componentDidMount() {
    this.props.vm.focus();
  }

  componentWillUnmount() {
    this.props.vm.unfocus();
  }

  render() {

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