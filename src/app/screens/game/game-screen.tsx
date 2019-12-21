import * as React from "react";
import { Background } from "../../ui-components/background/background-component";
import { Panel } from "../../ui-components/panel/panel-component";
import { GameStage } from "./game-stage/game-stage-component";
import { GameViewModel } from "../../view-model/game/game-view-model";
import { SelectedWorldPanel } from "./selected-world/selected-world-panel-component";

const TOP_BAR_HEIGHT = 75;
const RIGHT_PANEL_WIDTH = 400;

export class GameScreen extends React.Component<{vm: GameViewModel}> {

  render() {

    const gridContainerStyle: React.CSSProperties = {
      display: 'grid',
      height: '100vh',
      width: '100vw',
      gridTemplateColumns: `[start] auto [panels-start] ${RIGHT_PANEL_WIDTH}px [end]`,
      gridTemplateRows: `[start] ${TOP_BAR_HEIGHT}px [main-start] auto [middle-start] 500px [bottom-start] 300px [end]`,
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
          <Panel style={topLeftPanelStyle}>
            TOP LEFT
          </Panel>
          <SelectedWorldPanel 
            vm={this.props.vm.selectedWorldViewModel} 
            style={middleRightPanelStyle}
          />
          <Panel style={bottomRightPanelStyle}>
            BOTTOM RIGHT
          </Panel>
          <GameStage style={gameStageStyle} vm={this.props.vm.gameStageViewModel} />
        </div>
      </Background>
    )
  }
}