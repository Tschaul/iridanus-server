import React from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { createClasses } from '../../../ui-components/setup-jss';
import { hoverYellow, screenWhite } from '../../../ui-components/colors/colors';
import { HasExitAnimation } from '../../../ui-components/animatable-components';
import { Panel } from '../../../ui-components/panel/panel-component';
import { PanelDivider } from '../../../ui-components/panel/panel-divider';
import { Button } from '../../../ui-components/button/button';
import { AnalyticsViewModel } from '../../../view-model/game/analytics-view-model';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const classes = createClasses({
  row: {
    transition: "color 0.3s, fill 0.3s",
    cursor: 'pointer',
    color: screenWhite,
    "&:hover": {
      color: hoverYellow
    }
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  panel: {
    width: '100%',
    maxWidth: 500,
  }
});

const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];

@observer
export class AnalyticsPanel extends React.Component<{
  vm: AnalyticsViewModel
}> implements HasExitAnimation {

  panel: Panel | null;

  async fadeOut() {
    if (this.panel) {
      await this.panel.fadeOut();
    }
  }

  constructor(props: any) {
    super(props);
    this.props.vm.focus()
  }

  async refreshPanel() {
    if (this.panel) {
      await this.panel.refreshAnimation();
    }
  }

  render() {

    const flexContainerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%'
    }

    return (
      <div style={flexContainerStyle}>
        {this.renderChart()}
      </div>
    )
  }

  renderChart() {
    const [min, max] = this.props.vm.timestampRange
    return (
      <Panel panelClassName={classNames(classes.panel)} contentClassName={classNames(classes.panelContent)} fadeDirection="top" ref={elem => this.panel = elem}>
        <div>
          <LineChart
            onClick={this.handeClick}
            width={500}
            height={300}
            data={this.props.vm.shipsData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" fill="darkgrey" />
            <XAxis
              tickFormatter={this.formatTick}
              type="number"
              dataKey="timestamp"
              stroke={screenWhite}
              domain={[min, max]}
            />
            <YAxis stroke={screenWhite} />
            <Line type="monotone" dataKey="tschaul" stroke="red" dot={false} strokeWidth={3} />
            <Line type="monotone" dataKey="zabea" stroke="blue" dot={false} strokeWidth={3} />
          </LineChart>
        </div>
        <Button onClick={this.handeClose}>CLOSE</Button>
      </Panel>
    )
  }

  @autobind
  private handeClick(data: any) {
    const timestamp = data?.activeLabel
    if (timestamp) {
      this.props.vm.setTimestamp(timestamp)
    }
  }

  @autobind
  private handeClose() {
    this.props.vm.closeAnalyticsPanel()
  }

  @autobind
  private formatTick(timestamp: number) {
    return new Date(timestamp).toLocaleDateString()
  }

  componentWillUnmount() {
    this.props.vm.unfocus()
  }

}