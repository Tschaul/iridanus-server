import * as React from "react";
import { Background } from "../../ui-components/background/background-component";
import { Panel } from "../../ui-components/panel/panel-component";
import { Button } from "../../ui-components/button/button";
import { WelcomeViewModel } from "../../view-model/welcome/welcome-view-model";
import { InputString } from "../../ui-components/input/input-component";
import { wrapObservable } from "../helper/wrap-observable";
import autobind from "autobind-decorator";

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

    const eridanusAscii = (
      <div style={{whiteSpace: 'pre'}}>
  {`
 _____      _     _                       
| ____|_ __(_) __| | __ _ _ __  _   _ ___ 
|  _| | '__| |\/ _\` |\/ _\` \| \'_ \\| | | / __|
| |___| |  | | (_| | (_| | | | | |_| \\__ \\
|_____|_|  |_|\\__,_|\\__,_|_| |_|\\__,_|___/
                                            `}</div>
    )

    return (
      <Background>
        <div style={flexContainerStyle}>
          <Panel style={{width: 500, height: 500}}>
            Welcome to {eridanusAscii}
            
            <br/>
            please enter login<br/>
            ><InputString value={wrapObservable(this.props.vm, 'username')} /><br/>
            <br/>
            <br/>
            please enter password<br/>
            ><InputString value={wrapObservable(this.props.vm, 'password')} /><br/>
            <br/>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button onClick={this.handleEnterClick}>ENTER</Button>
            </div>
          </Panel>
        </div>
      </Background>
    )
  }

  @autobind
  handleEnterClick() {
    this.props.vm.login();
  }
}