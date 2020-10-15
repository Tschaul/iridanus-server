import React from 'react';
import { LobbyViewModel } from '../../view-model/lobby/lobby-view-model';
import { Panel } from '../../ui-components/panel/panel-component';
import { GameInfo } from '../../../shared/model/v1/game-info';
import autobind from 'autobind-decorator';
import { Button } from '../../ui-components/button/button';
import { observer } from 'mobx-react';
import { getClosestAttribute } from '../helper/get-attribute';
import { HasExitAnimation } from '../../ui-components/animatable-components';
import { PanelDivider } from '../../ui-components/panel/panel-divider';
import { createClasses } from '../../ui-components/setup-jss';
import { screenWhite, selectedYellow, hoverYellow, selectedYellowRaw } from '../../ui-components/colors/colors';
import classNames from 'classnames';
import { AccountViewModel } from '../../view-model/account/account-view-model';

const classes = createClasses({
  row: {
    transition: "color 0.3s",
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

@observer
export class AccountScreen extends React.Component<{
  vm: AccountViewModel
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

    const infos = this.props.vm.userInfos.current;
    return (
      <div style={flexContainerStyle}>
        <Panel panelClassName={classNames(classes.panel)} contentClassName={classNames(classes.panel)} fadeDirection="top" ref={elem => this.panel = elem}>
          <div>
            ACCOUNT
          <PanelDivider />
          </div>
          <div style={{ flex: 1 }}>
            user id: {infos.userId} <br />
            email: {infos.email} {infos.emailConfirmed && '(confirmed)'} <br />
            {infos.telegramConfirmed ? (
              <p>Telegram is set up for game notifications</p>
            ) : (
                <p>Set up Telegram for game notifications:
                  <ol>
                    <li>Visit the Iridanus Telegram Bot at <a style={{color: selectedYellow}} target="blank" href={'https://t.me/' + this.props.vm.telegramBotName}>{this.props.vm.telegramBotName}</a></li>
                    <li>Hit /start</li>
                    <li>Enter /code <b>{infos.userId}</b> <b>{infos.telegramCode}</b></li>
                  </ol>
                </p>
              )}
          </div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={this.handleBackClick} spaceRight>BACK</Button>
          </div>
        </Panel>
      </div>
    )
  }

  @autobind
  handleBackClick() {
    this.props.vm.hideAccountSettings();
    this.refreshPanel();
  }

  componentWillUnmount() {
    this.props.vm.unfocus()
  }

}