import { observer } from "mobx-react";
import * as React from "react";
import { WelcomeViewModel } from "../../view-model/welcome/welcome-view-model";
import { HasExitAnimation } from "../../ui-components/animatable-components";
import { Panel } from "../../ui-components/panel/panel-component";
import { Button } from "../../ui-components/button/button";
import autobind from "autobind-decorator";

@observer
export class EmailConfirmedPanel extends React.Component<{
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
      height: 250, 
      display: 'flex', 
      justifyContent: 'stretch',
      flexDirection: 'column'
    }

    return (
        <div style={container}>
          <Panel contentStyle={panelContentStyle} ref={elem => this.panel = elem} fadeDirection="top">
              <div style={{flex: 1}}>
                Thank you. Your email address has been confirmed.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={this.handleContinue}>LOGIN</Button>
              </div>
          </Panel>
        </div>
    )
  }
  
  @autobind
  handleContinue() {
    this.props.vm.mode = 'LOGIN';
  }

}