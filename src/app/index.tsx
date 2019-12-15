import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "reflect-metadata";
import { GameScreen } from './screens/game/game-screen';
import { Container } from 'inversify';
import { MainViewModel } from './view-model/main-view-model';
import {observer} from 'mobx-react'
import { registerViewModels } from './view-model/register-view-models';


const container =  new Container({
  defaultScope: "Singleton"
});

registerViewModels(container);

const vm = container.get(MainViewModel);

@observer
class App extends React.Component<{vm: MainViewModel}> {
  render() {
    switch(this.props.vm.activeScreen) {
      case 'GAME':
        return <GameScreen vm={this.props.vm.gameViewModel}></GameScreen>
    }
  }
}

ReactDOM.render(<App vm={vm}></App>,document.getElementById('root'))


