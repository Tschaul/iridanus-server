import * as React from "react";
import { Background } from "../../ui-components/background/background-component";
import { Panel } from "../../ui-components/panel/panel-component";
import { Button } from "../../ui-components/button/button";
import { WelcomeViewModel } from "../../view-model/welcome/welcome-view-model";
import { InputString } from "../../ui-components/input/input-component";
import { wrapObservable } from "../helper/wrap-observable";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";

@observer
export class WelcomeScreen extends React.Component<{
  vm: WelcomeViewModel
}> {
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

    return (
      <Background>
        <div style={flexContainerStyle}>
          <Panel style={{ width: 500, height: 500 }}>
            Welcome to {iridanusAscii}
            {this.renderForm()}

          </Panel>
        </div>
      </Background>
    )
  }

  renderForm() {
    switch (this.props.vm.mode) {
      case 'LOGIN':
        return this.renderLoginForm();
      case 'SIGN_UP':
        return this.renderSignUpForm();
    }
  }

  renderLoginForm() {
    return (
      <div>
        <br />
        please enter login<br />
        ><InputString value={wrapObservable(this.props.vm, 'username')} /><br />
        <br />
        <br />
        please enter password<br />
        ><InputString isPassword value={wrapObservable(this.props.vm, 'password')} /><br />
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={this.handleSignUpClick}>SIGN UP</Button>
          <Button onClick={this.handleLoginClick}>LOGIN</Button>
        </div>
      </div>
    )
  }

  renderSignUpForm() {
    return (
      <div>
        <br />
        please enter username<br />
        ><InputString value={wrapObservable(this.props.vm, 'username')} /><br />
        <br />
        please enter email<br />
        ><InputString value={wrapObservable(this.props.vm, 'email')} /><br />
        <br />
        please enter password<br />
        ><InputString value={wrapObservable(this.props.vm, 'password')} /><br />
        <br />
        please enter password again<br />
        ><InputString value={wrapObservable(this.props.vm, 'passwordRepeated')} /><br />
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={this.handleBackClick}>BACK</Button>
          <Button onClick={this.handleSubmitClick}>SUBMIT</Button>
        </div>
      </div>
    )
  }

  @autobind
  handleLoginClick() {
    this.props.vm.login();
  }

  @autobind
  handleBackClick() {
    this.props.vm.mode = 'LOGIN';
  }

  @autobind
  handleSubmitClick() {
    this.props.vm.signUp();
  }

  @autobind
  handleSignUpClick() {
    this.props.vm.mode = 'SIGN_UP';
  }
}