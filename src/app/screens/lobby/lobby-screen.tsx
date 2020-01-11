import * as React from 'react';
import { LobbyViewModel } from '../../view-model/lobby/lobby-view-model';
import { Background } from '../../ui-components/background/background-component';
import { Panel } from '../../ui-components/panel/panel-component';
import { GameInfo } from '../../../shared/model/v1/game-info';

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
          <Panel style={{ width: 500, height: 500 }}>
            LOBBY<br />
            ──────────────────────────────── <br />
            {this.props.vm.allGames.current.map(game => this.renderGame(game))}
          </Panel>
        </div>

      </Background>
    )
  }

  renderGame(game: GameInfo): JSX.Element {

    const displayName = game.id.toUpperCase().slice(0, 6);

    const isJoined = Object.getOwnPropertyNames(game.players).indexOf(this.props.vm.loggedInUserId || '') !== -1;

    return (
      <span>{displayName} · {game.state} · {isJoined ? 'JOINED' : ''}</span>
    )
  }

  componentWillUnmount() {
    this.props.vm.unfocus()
  }
}