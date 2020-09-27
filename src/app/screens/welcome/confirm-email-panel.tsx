import { observer } from "mobx-react";
import React from "react";
import { WelcomeViewModel } from "../../view-model/welcome/welcome-view-model";
import { HasExitAnimation } from "../../ui-components/animatable-components";
import { Panel } from "../../ui-components/panel/panel-component";

@observer
export class ConfirmEmailPanel extends React.Component<{
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
      height: '100%',
      width: '100%'
    }

    const panelContentStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'stretch',
      flexDirection: 'column'
    }

    const panelStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: 500,
      height: 250
    }

    return (
        <div style={container}>
          <Panel panelStyle={panelStyle} contentStyle={panelContentStyle} ref={elem => this.panel = elem} fadeDirection="top">
              <div style={{flex: 1}}>
                Thank you for signing up. Please check your email account and follow the link that we sent you.
              </div>
          </Panel>
        </div>
    )
  }

}