import * as React from 'react';
import { LobbyViewModel } from '../../view-model/lobby/lobby-view-model';
import { Panel } from '../../ui-components/panel/panel-component';
import { GameInfo } from '../../../shared/model/v1/game-info';
import autobind from 'autobind-decorator';
import { Button } from '../../ui-components/button/button';
import { observer } from 'mobx-react';
import { getClosestAttribute } from '../helper/get-attribute';
import { HasExitAnimation } from '../../ui-components/animatable-components';
import { PanelDivider } from '../../ui-components/panel/panel-divider';
import { createClasses } from '../../ui-components/setup-jss';
import { screenWhite, selectedYellow, hoverYellow } from '../../ui-components/colors/colors';
import classNames from 'classnames';

const classes = createClasses({
  row: {
    transition: "color 0.3s",
    cursor: 'pointer',
    color: screenWhite,
    "&:hover": {
      color: hoverYellow
    }
  },
  panel: {
    width: 500,
    height: 500,
    display: 'flex',
    flexDirection: 'column'
  }
});

@observer
export class LobbyScreen extends React.Component<{
  vm: LobbyViewModel
}> implements HasExitAnimation {

  panel: Panel | null;

  async fadeOut() {
    if (this.panel) {
      await this.panel.fadeOut();
    }
  }

  constructor(props: any) {
    super(props);
    this.props.vm.focus()
  }

  async refreshPanel() {
    if (this.panel) {
      await this.panel.refreshAnimation();
    }
  }

  render() {

    const flexContainerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }

    return (
      <div style={flexContainerStyle}>
        {this.props.vm.selectedGame ? this.renderGame() : this.renderLobby()}
      </div>
    )
  }

  renderGame() {
    const game = this.props.vm.selectedGame;
    if (!game) {
      return;
    }
    return (
      <Panel contentClassName={classNames(classes.panel)} fadeDirection="top" ref={elem => this.panel = elem}>
        <div>
          GAME {game.id.toUpperCase().slice(0, 6)} [{game.state}]
        <PanelDivider />
        </div>
        <div style={{ flex: 1 }}>{this.renderPlayerRows()}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {game.state === 'PROPOSED' && (
            this.playerHasJoinedGame() ? [
              <Button key="a" onClick={this.handleReadyClick}>READY</Button>,
              <Button key="b" spaceLeft onClick={this.handleToggleSpectatorClick}>TOGGLE SPEC.</Button>
            ] : [
              <Button key="a" onClick={this.handleJoinClick}>JOIN</Button>
            ]
          )}
          <PanelDivider />
          {game.state === 'STARTED' && this.playerHasJoinedGame() && (
            <Button onClick={this.handleViewClick} spaceRight>VIEW</Button>
          )}
          <Button onClick={this.handleBackClick}>BACK</Button>
        </div>
      </Panel>
    )
  }

  @autobind
  handleBackClick() {
    this.props.vm.selectedGameId = null;
    this.refreshPanel();
  }

  @autobind
  handleReadyClick() {
    this.props.vm.readyForGame();
  }

  @autobind
  handleJoinClick() {
    this.props.vm.joinGame();
  }

  @autobind
  handleToggleSpectatorClick() {
    this.props.vm.toggleSpecatatorMode();
  }

  @autobind
  handleViewClick() {
    this.props.vm.viewGame();
  }

  renderLobby() {
    return (
      <Panel contentClassName={classNames(classes.panel)} fadeDirection="top" ref={elem => this.panel = elem}>
        <div>
          LOBBY
          <PanelDivider />
        </div>
        <div style={{ flex: 1 }}>
          {this.props.vm.gamesToDisplay.map(game => this.renderGameRow(game))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={this.handleCreateGameClick}>CREATE GAME</Button>
        </div>
      </Panel>
    )
  }

  @autobind
  handleCreateGameClick() {
    this.props.vm.createGame();
  }

  renderGameRow(game: GameInfo): JSX.Element {

    const displayName = game.id.toUpperCase().slice(0, 6);

    const isJoined = Object.getOwnPropertyNames(game.players).indexOf(this.props.vm.loggedInUserId || '') !== -1;

    return (
      <div className={classNames(classes.row)} data-game-id={game.id} onClick={this.handeGameClick}>{displayName} · {game.state} · {isJoined ? 'JOINED' : ''}</div>
    )
  }

  renderPlayerRows(): JSX.Element[] {

    const game = this.props.vm.selectedGame;

    if (!game) {
      return [<span />]
    }

    return Object.values(game.players).map(playerInfo => {
      return (
        <div><span style={{ color: playerInfo.color }}>{playerInfo.id}</span> · {playerInfo.state} {playerInfo.isSpectator && '· spectator'}</div>
      )
    })
  }

  @autobind
  public handeGameClick(event: React.MouseEvent) {
    const gametId = getClosestAttribute(event, 'data-game-id');
    this.props.vm.selectedGameId = gametId;
    this.refreshPanel();
  }

  componentWillUnmount() {
    this.props.vm.unfocus()
  }

  private playerHasJoinedGame() {

    const game = this.props.vm.selectedGame;
    const playerId = this.props.vm.loggedInUserId;

    if (!game || !playerId) {
      return false;
    }

    return Object.getOwnPropertyNames(game.players).includes(playerId)
  }
}