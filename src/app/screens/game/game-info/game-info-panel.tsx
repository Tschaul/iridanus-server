import * as React from "react";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import classNames from "classnames";
import { Panel } from "../../../ui-components/panel/panel-component";
import { PanelDivider } from "../../../ui-components/panel/panel-divider";
import { ScoringsViewModel } from "../../../view-model/game/scorings-view-model";

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
          return (
            <div>
              <span style={{ color: scoring.color }}>{scoring.id}</span>
              <span style={{ width: '10em' }}>{scoring.currentScore}+{scoring.scoreDeltaPerWeek}</span>
            </div>
          );
        })}
      </Panel>
    )
  }
}