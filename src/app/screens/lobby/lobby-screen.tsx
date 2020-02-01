import * as React from 'react';
import { LobbyViewModel } from '../../view-model/lobby/lobby-view-model';
import { Background } from '../../ui-components/background/background-component';
import { Panel } from '../../ui-components/panel/panel-component';
import { GameInfo } from '../../../shared/model/v1/game-info';
import autobind from 'autobind-decorator';
import { Button } from '../../ui-components/button/button';
import { observer } from 'mobx-react';
import { getClosestAttribute } from '../helper/get-attribute';
import { SelectBox } from '../../ui-components/input/select-component';

@observer
export class LobbyScreen extends React.Component<{
  vm: LobbyViewModel
}> {

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
      <Background>
        <div style={flexContainerStyle}>
          {this.props.vm.selectedGame ? this.renderGame() : this.renderLobby()}
        </div>

      </Background>
    )
  }

  renderGame() {
    const game = this.props.vm.selectedGame;
    if (!game) {
      return;
    }
    return (
      <Panel style={{ width: 500, height: 500 }}>
        GAME {game.id.toUpperCase().slice(0,5)}<br />
        ──────────────────────────────── <br />
        <SelectBox options={[{key: '1', name: 'foobar'}]} display={v => v.name} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={this.handleBackClick}>BACK</Button>
        </div>
      </Panel>
    )
  }
  handleBackClick(): (() => void) | undefined {
    throw new Error("Method not implemented.");
  }

  renderLobby() {
    return (
      <Panel style={{ width: 500, height: 500 }}>
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
      <div data-game-id={game.id} onClick={this.handeGameClick}>{displayName} · {game.state} · {isJoined ? 'JOINED' : ''}</div>
    )
  }

  @autobind
  public handeGameClick(event: React.MouseEvent) {
    const gametId = getClosestAttribute(event, 'data-game-id');
    this.props.vm.selectedGameId = gametId;
  }

  componentWillUnmount() {
    this.props.vm.unfocus()
  }
}