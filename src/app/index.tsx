import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "reflect-metadata";
import { GameScreen } from './screens/game/game-screen';
import { MainViewModel } from './view-model/main-view-model';
import { observer } from 'mobx-react'
import { setupContainerRegistry } from './container-registry';
import { WelcomeScreen } from './screens/welcome/welcome-screen';
import { LobbyScreen } from './screens/lobby/lobby-screen';
import { TooltipOverlay } from './ui-components/tooltip/tooltip-overlay.component';

setupContainerRegistry();

const vm = new MainViewModel();

@observer
class App extends React.Component<{ vm: MainViewModel }> {

  render() {
    return (
      <TooltipOverlay>
        {this.renderScreen()}
      </TooltipOverlay>
    )
  }

  renderScreen() {
    switch (this.props.vm.activeScreen) {
      case 'GAME':
        return <GameScreen vm={this.props.vm.gameViewModel}></GameScreen>
      case 'WELCOME':
        return <WelcomeScreen vm={this.props.vm.welcomeViewModel}></WelcomeScreen>
      case 'LOBBY':
        return <LobbyScreen vm={this.props.vm.lobbyViewModel}></LobbyScreen>
    }
  }
}

ReactDOM.render(<App vm={vm}></App>, document.getElementById('root'))


