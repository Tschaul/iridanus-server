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
}, {
  elementWidth: number,
  elementHeight: number
}> {

  state = {
    elementWidth: 0,
    elementHeight: 0
  }

  stageWrapper: HTMLDivElement | null;


  render() {

    const scale = this.state.elementWidth / this.props.vm.stageWidth
    const transform = `translate(${-this.props.vm.stageWidth / 2}px,${-this.props.vm.stageHeight / 2}px) scale(${scale}) translate(${this.state.elementWidth / 2 / scale}px,${(this.state.elementHeight / 2 / scale)+60}px)`;

    const viewBox = `0 0 ${this.props.vm.stageWidth} ${this.props.vm.stageHeight}`
    return (
      <div ref={e => this.stageWrapper = e} style={{ width: '100%', height: '100%', position: 'absolute' }} className={classNames(this.props.className)}>
        {this.props.vm.doneLoading && <svg style={{
          position: 'fixed',
          height: this.props.vm.stageHeight,
          width: this.props.vm.stageWidth,
          transform, //
          left: 0,
          top: 0,
        }} className="fade-in-screen" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
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

    this.props.vm.stageWidth = Math.max(element.offsetWidth, 1024);
    this.props.vm.stageHeight = Math.max(element.offsetHeight, 1024);

    this.setState({
      elementWidth: element.offsetWidth,
      elementHeight: element.offsetHeight
    })

    // alert(`scale(${element.offsetWidth/this.props.vm.stageWidth},${element.offsetHeight/this.props.vm.stageWidth})`)
  }

  @autobind
  updateModifierKeyStates(e: KeyboardEvent) {
    this.props.vm.setAltKeyState(e.altKey);
  }

  @autobind
  detectKeys(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      this.props.vm.forwardInTime()
    }
    if (e.key === 'ArrowLeft') {
      this.props.vm.backwardInTime()
    }
  }

  componentDidMount(): void {

    window.addEventListener('resize', this.updateStateFromElement);
    window.addEventListener('keydown', this.updateModifierKeyStates);
    window.addEventListener('keyup', this.updateModifierKeyStates);

    window.addEventListener('keydown', this.detectKeys);

    this.updateStateFromElement()
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.updateStateFromElement)
    window.removeEventListener('keydown', this.updateModifierKeyStates)
    window.removeEventListener('keyup', this.updateModifierKeyStates)
  }
}