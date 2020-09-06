import React from "react";
import { observer } from "mobx-react";
import { screenWhite } from "../colors/colors";
import ScrollArea from 'react-scrollbar';

@observer
export class Scroll extends React.Component {
  render() {

    return <ScrollArea
      style={{ height: "100%" }}
      smoothScrolling={true}
      verticalScrollbarStyle={{
        backgroundColor: screenWhite,
        borderRadius: '0.25ex'
      }}
    >
      {this.props.children}
    </ScrollArea>
  }
}