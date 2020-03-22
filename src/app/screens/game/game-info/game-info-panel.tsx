import * as React from "react";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import classNames from "classnames";
import { Panel } from "../../../ui-components/panel/panel-component";
import { PanelDivider } from "../../../ui-components/panel/panel-divider";
import { ScoringsViewModel } from "../../../view-model/game/scorings-view-model";
import { hoverYellow } from "../../../ui-components/colors/colors";

@observer
export class GameInfoPanel extends React.Component<{
  vm: ScoringsViewModel,
  panelClassName?: string,
}> {
  render() {
    return (
      <Panel
        panelClassName={classNames(this.props.panelClassName)}
        fadeDirection="right"
      >
        Score
        <PanelDivider />
        {this.props.vm.scoringsDisplay.map(scoring => {
          const rowStyle: React.CSSProperties = {
            display: 'flex',
            justifyContent: 'space-between'
          }
          const playerColStyle: React.CSSProperties = {
            display: 'inline-block',
            color: scoring.color,
            width: '7ex'
          }
          const barWrapperStyle: React.CSSProperties = {
            display: 'inline-block',
            position: 'relative',
            width: '15ex',
            textAlign: 'center',
            backgroundColor: 'rgb(145, 145, 145)'
          }
          const barStyle: React.CSSProperties = {
            position: 'absolute',
            height: '100%',
            width: Math.round(100 * scoring.currentScore / scoring.finalScore)+'%',
            backgroundColor: hoverYellow,
            opacity: 0.4,
            top: 0,
            left: 0,
          }
          const barContentStyle: React.CSSProperties = {
            display: 'inline-block',
            zIndex: 9
          }

          return (
            <div style={rowStyle}>
              <span style={playerColStyle}>{scoring.id}</span>
              <span style={barWrapperStyle}>
                <span style={barStyle} />
                <span style={barContentStyle}>{scoring.currentScore}&thinsp;+&thinsp;{scoring.scoreDeltaPerWeek}&thinsp;⦀/w</span>
              </span>
            </div>
          );
        })}
      </Panel>
    )
  }
}