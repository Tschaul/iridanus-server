import React from "react";
import { Panel } from "../../../ui-components/panel/panel-component";
import classNames from "classnames";
import { Button } from "../../../ui-components/button/button";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { TopBarViewModel } from "../../../view-model/game/top-bar-view-model";
import { createClasses } from "../../../ui-components/setup-jss";
import { getClosestAttribute } from "../../helper/get-attribute";
import { Stats, StatType } from "../../../view-model/game/game-stats";
import { hoverYellow, errorRed, selectedYellow } from "../../../ui-components/colors/colors";
import { getDisplayDuration } from "../../../ui-components/display-duration";
import { Subscription } from "rxjs";
import { reaction, IReactionDisposer } from "mobx";
import { symbol } from "../helper/symbols";
import { IconHtml } from "../../../ui-components/icons/icon-html-component";

const classes = createClasses({
  statsItem: {
    transition: 'color 0.3s, fill 0.3s',
    marginLeft: '0.5em',
    "&:hover": {
      color: hoverYellow,
      fill: hoverYellow
    }
  }
})

@observer
export class TopBar extends React.Component<{
  vm: TopBarViewModel,
  panelClassName?: string,
  onToggleBurgerButton?: () => void
}> {
  state: { gameStartDuration: string | null } = { gameStartDuration: null }

  subscription: Subscription = Subscription.EMPTY;
  reactionDisposer: IReactionDisposer;

  componentWillMount() {
    this.reactionDisposer = reaction(
      () => this.props.vm.gameStartTimestamp,
      (gameStartTimestamp) => {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.subscription = getDisplayDuration(gameStartTimestamp).subscribe(gameStartDuration => {
          const now = new Date().getTime();
          if (now > gameStartTimestamp) {
            this.reactionDisposer();
            this.subscription.unsubscribe();
            this.setState({ gameStartDuration: null })
          } else {
            this.setState({ gameStartDuration })
          }
        })
      }
    )

  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.reactionDisposer) {
      this.reactionDisposer();
    }
  }

  render() {

    const stats = this.props.vm.totalStats;


    return <Panel
      panelClassName={classNames(this.props.panelClassName)}
      fadeDirection="left"
      contentStyle={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
    >
      <div style={{ display: 'flex', flex: 1 }}>
        {this.props.vm.selfIsSpectator ? (
          [
            <span>SPECTATOR</span>,
            <Button
              style={{ transform: 'translateY(-0.25em)', fontSize: 16, width: '3em' }}
              onClick={this.handleBackToLobby}
              spaceLeft
            >⏎</Button>
          ]
        ) : (
            [
              <Button
                disabled={this.props.vm.updatedOrdersCount === 0}
                style={{ transform: 'translateY(-0.25em)', fontSize: 16, width: '3em' }}
                onClick={this.handleSaveOrders}
                spaceRight
              >✓</Button>,
              <Button
                style={{ transform: 'translateY(-0.25em)', fontSize: 16, width: '3em' }}
                onClick={this.handleBackToLobby}
                spaceRight
              >⏎</Button>,
              <div style={{ flex: 1 }}></div>,
              this.props.onToggleBurgerButton && <Button
                style={{ transform: 'translateY(-0.25em)', fontSize: 16, width: '3em' }}
                onClick={this.props.onToggleBurgerButton}
              >≡</Button>
            ]
          )}
      </div>
      {this.renderStats(stats)}
      <div style={{ flex: 1 }}></div>
      <div />
    </Panel>
  }

  private renderStats(stats: Stats): React.ReactNode {

    const mouseHandler = {
      onMouseEnter: this.handleMouseEnterStatsItem,
      onMouseLeave: this.handleMouseLeaveStatsItem
    }
    return this.state.gameStartDuration ? <div style={{ color: selectedYellow }}>Game will start in {this.state.gameStartDuration}. Place your initial orders.</div> : <div>
      <span {...mouseHandler} data-stat={'POPULATION'} className={classNames(classes.statsItem)}>{stats.population}<IconHtml type="population"></IconHtml></span>
      <span {...mouseHandler} data-stat={'INDUSTRY'} className={classNames(classes.statsItem)}>{stats.industry}<IconHtml type="industry"></IconHtml></span>

      <span {...mouseHandler} data-stat={'METAL'} className={classNames(classes.statsItem)}>{stats.metal}<IconHtml type="metal"></IconHtml></span>
      <span {...mouseHandler} data-stat={'SHIPS'} className={classNames(classes.statsItem)}>{stats.ships}<IconHtml type="ships"></IconHtml></span>
    </div>;
  }

  @autobind
  public handleSaveOrders() {
    this.props.vm.saveOrderDrafts();
  }

  @autobind
  public handleBackToLobby() {
    this.props.vm.backToLobby();
  }

  @autobind
  private handleMouseEnterStatsItem(event: React.MouseEvent<HTMLDivElement>) {
    const statType = getClosestAttribute(event, 'data-stat') as StatType;
    this.props.vm.highlightStat(statType)
  }

  @autobind
  private handleMouseLeaveStatsItem() {
    this.props.vm.highlightStat('NONE');
  }
}