import React from 'react';
import { GameStageViewModel } from '../../../view-model/game/game-stage-view-model';
import { observer } from 'mobx-react';
import { GameStageBackdrop } from './game-stage-backdrop-component';
import { GameStageForeground } from './game-stage-foreground-component';
import { GameStageSelectedFleet } from './game-stage-selected-fleet';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

@observer
export class GameStage extends React.Component<{ 
  vm: GameStageViewModel, 
  className?: string,
}> {

  stageWrapper: HTMLDivElement | null;

  render() {
    const viewBox = `0 0 ${this.props.vm.stageWidth} ${this.props.vm.stageHeight}`
    return (
      <div ref={e => this.stageWrapper = e} style={{ width: '100%', height: '100%' }} className={classNames(this.props.className)}>
        {this.props.vm.doneLoading && <svg className="fade-in-screen" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
          <GameStageBackdrop vm={this.props.vm}></GameStageBackdrop>
          <GameStageForeground vm={this.props.vm}></GameStageForeground>
          <GameStageSelectedFleet vm={this.props.vm}></GameStageSelectedFleet>
        </svg>}
      </div>
    );
  }


  @autobind
  updateStateFromElement() {

    const element = this.stageWrapper

    if (!element) {
      return;
    }

    this.props.vm.stageWidth = element.offsetWidth;
    this.props.vm.stageHeight = element.offsetHeight;

  }

  @autobind
  updateModifierKeyStates(e: KeyboardEvent) {
    this.props.vm.setAltKeyState(e.altKey);
  }

  componentDidMount(): void {

    window.addEventListener('resize', this.updateStateFromElement);
    window.addEventListener('keydown', this.updateModifierKeyStates)
    window.addEventListener('keyup', this.updateModifierKeyStates)

    this.updateStateFromElement()
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.updateStateFromElement)
    window.removeEventListener('keydown', this.updateModifierKeyStates)
    window.removeEventListener('keyup', this.updateModifierKeyStates)
  }
}