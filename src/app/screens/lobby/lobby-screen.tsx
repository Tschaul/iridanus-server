import * as React from 'react';
import { LobbyViewModel } from '../../view-model/lobby/lobby-view-model';
import { Panel } from '../../ui-components/panel/panel-component';
import { GameInfo } from '../../../shared/model/v1/game-info';
import autobind from 'autobind-decorator';
import { Button } from '../../ui-components/button/button';
import { observer } from 'mobx-react';
import { getClosestAttribute } from '../helper/get-attribute';
import { HasExitAnimation } from '../../ui-components/animatable-components';

const clickableRowStyle: React.CSSProperties = {
  cursor: 'pointer'
}

@observer
export class LobbyScreen extends React.Component<{
  vm: LobbyViewModel
}> implements HasExitAnimation {
  async fadeOut() {}

  constructor(props: any) {
    super(props);
    this.props.vm.focus()
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
      <Panel panelStyle={{ width: 500, height: 500 }} fadeDirection="top">
        GAME {game.id.toUpperCase().slice(0, 5)} [{game.state}]<br />
        ──────────────────────────────── <br />
        {this.renderPlayerRows()}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {game.state === 'PROPOSED' && (
            this.playerHasJoinedGame()
              ? <Button onClick={this.handleReadyClick}>READY</Button>
              : <Button onClick={this.handleJoinClick}>JOIN</Button>
          )}
          {game.state === 'STARTED' && this.playerHasJoinedGame() && (
            <Button onClick={this.handleViewClick}>VIEW</Button>
          )}
          <Button onClick={this.handleBackClick}>BACK</Button>
        </div>
      </Panel>
    )
  }

  @autobind
  handleBackClick() {
    this.props.vm.selectedGameId = null;
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
  handleViewClick() {
    this.props.vm.viewGame();
  }

  renderLobby() {
    return (
      <Panel panelStyle={{ width: 500, height: 500 }} fadeDirection="top">
        LOBBY<br />
        ──────────────────────────────── <br />
        {this.props.vm.allGames.current.map(game => this.renderGameRow(game))}
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
      <div style={clickableRowStyle} data-game-id={game.id} onClick={this.handeGameClick}>{displayName} · {game.state} · {isJoined ? 'JOINED' : ''}</div>
    )
  }

  renderPlayerRows(): JSX.Element[] {

    const game = this.props.vm.selectedGame;

    if (!game) {
      return [<span/>]
    }

    return Object.values(game.players).map(playerInfo => {
      return (
        <div>{playerInfo.name} · {playerInfo.state}</div>
      )
    })
  }

  @autobind
  public handeGameClick(event: React.MouseEvent) {
    const gametId = getClosestAttribute(event, 'data-game-id');
    this.props.vm.selectedGameId = gametId;
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