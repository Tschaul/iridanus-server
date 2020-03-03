import * as React from "react";
import { WelcomeViewModel } from "../../view-model/welcome/welcome-view-model";
import { observer } from "mobx-react";
import { HasExitAnimation } from "../../ui-components/animatable-components";
import { LoginPanel } from "./login-panel";
import { SignUpPanel } from "./sign-up-panel";
import { reaction } from "mobx";

@observer
export class WelcomeScreen extends React.Component<{
  vm: WelcomeViewModel
}, {
  activePanel: 'LOGIN' | 'SIGN_UP'
}> implements HasExitAnimation {
  panel: HasExitAnimation | null;

  async fadeOut() {
    if (this.panel) {
      await this.panel.fadeOut();
    }
  }

  constructor(props: any) {
    super(props);
    this.state = {
      activePanel: this.props.vm.mode
    }
    reaction(
      () => this.props.vm.mode,
      async (value) => {
        if (this.panel) {
          await this.panel.fadeOut();
        }
        this.setState({
          activePanel: value
        });
      }
    )
  }

  render() {
    switch (this.state.activePanel) {
      case 'LOGIN':
        return <LoginPanel ref={elem => this.panel = elem} vm={this.props.vm}></LoginPanel>
      case 'SIGN_UP':
        return <SignUpPanel ref={elem => this.panel = elem} vm={this.props.vm}></SignUpPanel>
    }
  }

}