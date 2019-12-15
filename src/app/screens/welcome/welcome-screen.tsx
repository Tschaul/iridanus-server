import * as React from "react";
import { Background } from "../../ui-components/background/background-component";
import { Panel } from "../../ui-components/panel/panel-component";
import { Button } from "../../ui-components/button/button";

export class WelcomScreen extends React.Component {
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
            ><br/>
            <br/>
            <br/>
            please enter password<br/>
            ><br/>
            <br/>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button>ENTER</Button>
            </div>
          </Panel>
        </div>
      </Background>
    )
  }
}