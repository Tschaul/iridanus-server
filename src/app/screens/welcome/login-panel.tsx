import { observer } from "mobx-react";
import * as React from "react";
import { WelcomeViewModel } from "../../view-model/welcome/welcome-view-model";
import { HasExitAnimation } from "../../ui-components/animatable-components";
import { Panel } from "../../ui-components/panel/panel-component";
import { Input } from "../../ui-components/input/input-component";
import { wrapObservable } from "../helper/wrap-observable";
import classNames from "classnames";
import { Button } from "../../ui-components/button/button";
import autobind from "autobind-decorator";
import { errorRed, hoverYellow } from "../../ui-components/colors/colors";

@observer
export class LoginPanel extends React.Component<{
  vm: WelcomeViewModel
}> implements HasExitAnimation {

  panel: Panel | null;

  async fadeOut() {
    if (this.panel !== null) {
      await this.panel.fadeOut();
    }
  }

  render() {

    const flexContainerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }

    const iridanusAscii = (
      <div style={{ whiteSpace: 'pre' }}>
        {`
    _      _     _                       
   | |_ __(_) __| | __ _ _ __  _   _ ___ 
   | | '__| |\/ _\` |\/ _\` \| \'_ \\| | | / __|
   | | |  | | (_| | (_| | | | | |_| \\__ \\
   |_|_|  |_|\\__,_|\\__,_|_| |_|\\__,_|___/
                                            `}</div>
    )


    const panelContentStyle: React.CSSProperties = {
      width: 500,
      height: 500,
      display: 'flex',
      justifyContent: 'stretch',
      flexDirection: 'column'
    }

    return (
      <div style={flexContainerStyle}>
        <Panel contentStyle={panelContentStyle} ref={elem => this.panel = elem} fadeDirection="top">
          <div style={{ flex: 1 }}>
            <form>
              Welcome to {iridanusAscii}
              <br />
              please enter login<br />
              ><Input autocomplete="username" type="text" value={wrapObservable(this.props.vm, 'username')} onEnterKey={this.handleLoginClick} /><br />
              <br />
              please enter password<br />
              ><Input autocomplete="current-password" type="password" value={wrapObservable(this.props.vm, 'password')} onEnterKey={this.handleLoginClick} /><br />
              <br />
              <a style={{ color: hoverYellow }} onClick={this.handlePasswordForgotten}>password forgotten?</a>
            </form>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {this.props.vm.loginError && <small className={classNames('fade-in-screen')} style={{ flex: 1, color: errorRed }}>username or password is incorrect</small>}
              <Button onClick={this.handleSignUpClick} spaceRight>SIGN UP</Button>
              <Button onClick={this.handleLoginClick}>LOGIN</Button>
            </div>
          </div>

        </Panel>
      </div>
    )
  }

  @autobind
  handlePasswordForgotten() {
    this.props.vm.mode = 'FORGOT_PASSWORD'
  }

  @autobind
  handleLoginClick() {
    this.props.vm.login();
  }

  @autobind
  handleSignUpClick() {
    this.props.vm.mode = 'SIGN_UP';
  }

}