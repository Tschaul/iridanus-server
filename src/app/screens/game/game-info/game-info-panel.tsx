import * as React from "react";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import classNames from "classnames";
import { Panel } from "../../../ui-components/panel/panel-component";
import { PanelDivider } from "../../../ui-components/panel/panel-divider";
import { ScoringsViewModel } from "../../../view-model/game/scorings-view-model";
import { hoverYellow } from "../../../ui-components/colors/colors";
import { InfoPanelViewModel } from "../../../view-model/game/info-panel-view-model";
import { createClasses } from "../../../ui-components/setup-jss";
import { reaction, IReactionDisposer } from "mobx";
import { getDisplayDuration, Duration } from "../../../ui-components/display-duration";
import { Subscription } from "rxjs";
import { Scroll } from "../../../ui-components/scroll-area/scroll-component";
import { UpdateFleetOrdersExecutor } from "../../../../server/commands/executors/orders/update-fleet-orders-executor";

const classes = createClasses({
  tab: {
    transition: 'color 0.3s',
    cursor: 'pointer',
    "&:hover": {
      color: hoverYellow
    },
    "&.active": {
      textDecoration: 'underline'
    }
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }
});

@observer
export class GameInfoPanel extends React.Component<{
  vm: InfoPanelViewModel,
  panelClassName?: string,
}> {

  state: { gameEndDuration: string | null } = { gameEndDuration: null }

  panel: Panel | null;
  reactionDisposerDisplayedTab: IReactionDisposer;
  reactionDisposerGameEndTimestamp: IReactionDisposer;
  gameEndTimestampSubscription: Subscription;

  componentDidMount() {
    this.reactionDisposerDisplayedTab = reaction(
      () => this.props.vm.displayedTab,
      () => {
        if (this.panel) {
          this.panel.refreshAnimation()
        }
      }
    )

    this.reactionDisposerGameEndTimestamp = reaction(
      () => this.props.vm.scoringsViewModel.gameEndTimestamp,
      (gameEndTimestamp) => {
        if (this.gameEndTimestampSubscription) {
          this.gameEndTimestampSubscription.unsubscribe();
        }
        this.gameEndTimestampSubscription = getDisplayDuration(gameEndTimestamp).subscribe(gameEndDuration => {
          this.setState({ gameEndDuration })
        })
      }
    )
  }

  componentWillUnmount() {
    this.reactionDisposerDisplayedTab()
  }

  render() {

    return <Panel
      panelClassName={classNames(this.props.panelClassName)}
      contentClassName={classNames(classes.panelContent)}
      fadeDirection="right"
      ref={panel => this.panel = panel}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div onClick={this.handleScoringsClick} className={classNames(classes.tab, { active: this.props.vm.displayedTab === 'SCORINGS' })}>Score</div>
          <div onClick={this.handleNotificationsClick} className={classNames(classes.tab, { active: this.props.vm.displayedTab === 'NOTIFICATIONS' })}>Notifications</div>
        </div>
        <PanelDivider />
      </div>
      {this.renderContent()}
    </Panel>

  }

  renderContent() {
    switch (this.props.vm.displayedTab) {
      case 'NOTIFICATIONS':
        const notifications = this.props.vm.notificationsViewModel.notifications;
        return <div style={{ flex: '1 1 auto', height: '1em' }}>
          <Scroll>
            {notifications.map(notification => {
              return <div key={notification.id} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                <Duration timestamp={notification.timestamp} /> {notification.type}
              </div>
            })}
          </Scroll>
        </div>

      case 'SCORINGS':
        return <div>
          <div>
            Game ends when one player reaches {this.props.vm.scoringsViewModel.gameEndScoreDisplay} or in {this.state.gameEndDuration}.<br /><br />
          </div>
          <div>
            {this.props.vm.scoringsViewModel.scoringsDisplay.map(scoring => {
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
                width: Math.round(100 * scoring.currentScore / scoring.finalScore) + '%',
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
                <div style={rowStyle} key={scoring.id}>
                  <span style={playerColStyle}>{scoring.id}</span>
                  <span style={barWrapperStyle}>
                    <span style={barStyle} />
                    <span style={barContentStyle}>{scoring.currentScore}&thinsp;+&thinsp;{scoring.scoreDeltaPerWeek}&thinsp;⦀/w</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
    }
  }

  @autobind
  handleScoringsClick() {
    this.props.vm.displayedTab = 'SCORINGS';
  }

  @autobind
  handleNotificationsClick() {
    this.props.vm.displayedTab = 'NOTIFICATIONS';
  }
}