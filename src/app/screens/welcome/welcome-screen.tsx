import * as React from "react";
import { Background } from "../../ui-components/background/background-component";
import { Panel } from "../../ui-components/panel/panel-component";

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
            >
          </Panel>
        </div>
      </Background>
    )
  }
}