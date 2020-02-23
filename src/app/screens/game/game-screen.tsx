import * as React from "react";
import { Background } from "../../ui-components/background/background-component";
import { Panel } from "../../ui-components/panel/panel-component";
import { GameStage } from "./game-stage/game-stage-component";
import { GameViewModel } from "../../view-model/game/game-view-model";
import { SelectedWorldPanel } from "./selected-world/selected-world-panel-component";
import { OrderEditor } from "./order-editor/order-editor-component";
import { SwitchableScreen } from "./screen";

const TOP_BAR_HEIGHT = 75;
const RIGHT_PANEL_WIDTH = 420;

const MIDDLE_PANEL_HEIGHT = 500;
const BOTTOM_PANEL_HEIGHT = 300;

export class GameScreen extends React.Component<{vm: GameViewModel}> implements SwitchableScreen {

  async fadeOut() {}

  componentDidMount() {
    this.props.vm.focus();
  }

  componentWillUnmount() {
    this.props.vm.unfocus();
  }

  render() {

    const gridContainerStyle: React.CSSProperties = {
      display: 'grid',
      height: '100vh',
      width: '100vw',
      gridTemplateColumns: `[start] auto [panels-start] ${RIGHT_PANEL_WIDTH}px [end]`,
      gridTemplateRows: `[start] ${TOP_BAR_HEIGHT}px [main-start] auto [middle-start] ${MIDDLE_PANEL_HEIGHT}px [bottom-start] ${BOTTOM_PANEL_HEIGHT}px [end]`,
      position: 'fixed',
      top: 0,
      left: 0
    }

    const topLeftPanelStyle: React.CSSProperties = {
      gridColumn: 'start / panels-start',
      gridRow: 'start / main-start',
    }

    const middleRightPanelStyle: React.CSSProperties = {
      gridColumn: 'panels-start / end',
      gridRow: 'middle-start / bottom-start',
    }

    const bottomRightPanelStyle: React.CSSProperties = {
      gridColumn: 'panels-start / end',
      gridRow: 'bottom-start / end',
    }

    const gameStageStyle: React.CSSProperties = {
      gridColumn: 'start / panels-start',
      gridRow: 'main-start / end',
      overflow: 'hidden'
    }

    return (
      <Background>
        <div style={gridContainerStyle}>
          <Panel style={topLeftPanelStyle} fadeDirection="left">
            TOP LEFT
          </Panel>
          <SelectedWorldPanel 
            vm={this.props.vm.selectedWorldViewModel} 
            style={middleRightPanelStyle}
          />
          <OrderEditor
            vm={this.props.vm.orderEditorViewModel} 
            style={bottomRightPanelStyle}
          />
          <GameStage style={gameStageStyle} vm={this.props.vm.gameStageViewModel} />
        </div>
      </Background>
    )
  }
}