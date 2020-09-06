import { observer } from "mobx-react";
import React from "react";
import { WelcomeViewModel } from "../../view-model/welcome/welcome-view-model";
import { HasExitAnimation } from "../../ui-components/animatable-components";
import { Panel } from "../../ui-components/panel/panel-component";
import { Input } from "../../ui-components/input/input-component";
import { wrapObservable } from "../helper/wrap-observable";
import { Button } from "../../ui-components/button/button";
import autobind from "autobind-decorator";

@observer
export class ForgotPasswordPanel extends React.Component<{
  vm: WelcomeViewModel
}> implements HasExitAnimation {

  panel: Panel | null;

  async fadeOut() {
    if (this.panel) {
      await this.panel.fadeOut();
    }
  }

  render() {

    const container: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }

    const panelContentStyle: React.CSSProperties = { 
      width: 500, 
      height: 500, 
      display: 'flex', 
      justifyContent: 'stretch',
      flexDirection: 'column'
    }

    return (
        <div style={container}>
          <Panel contentStyle={panelContentStyle} ref={elem => this.panel = elem} fadeDirection="top">
              <div style={{flex: 1}}>
                Password forgotten? 
                <br />
                <br />
                Please enter you username an we will send you a password reset link.
                <br />
                <br />
                please enter username<br />
                ><Input type="text" value={wrapObservable(this.props.vm, 'username')} /><br />
                <br />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={this.handleBackClick} spaceRight>BACK</Button>
                <Button onClick={this.handleSubmitClick}>SUBMIT</Button>
              </div>
          </Panel>
        </div>
    )
  }

  @autobind
  handleBackClick() {
    this.props.vm.mode = 'LOGIN';
  }

  @autobind
  handleSubmitClick() {
    this.props.vm.forgotPassword();
  }

}