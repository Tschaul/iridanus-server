import React from 'react';
import { screenWhite } from '../colors/colors';

export class PanelDivider extends React.Component<{

}> {

  render() {
    return <hr style={{borderTop: '2px solid '+screenWhite}}></hr>
  }
}