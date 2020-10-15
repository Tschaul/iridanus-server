import React from 'react';
import { observer } from 'mobx-react';
import { PopulationByPlayer } from '../../../../shared/model/v1/world';
import { PlayersViewModel } from '../../../view-model/game/player-infos-view-model';
import { totalAmount } from '../../../../shared/math/distributions/distribution-helper';

@observer
export class PopulationStats extends React.Component<{
  population: PopulationByPlayer,
  playerInfos: PlayersViewModel
}> {

  render() {
    const { population } = this.props;

    const total = totalAmount(population);

    if (total === 0) {
      return <span>0</span>
    }

    const keys = Object.getOwnPropertyNames(population).filter(key => population[key]);
    return <span>
      {keys.map((key, index) => {
        return <span key={key} style={{ color: this.props.playerInfos.getColorForPlayer(key) }}>{population[key]}{(index !== keys.length - 1) && '+'}</span>
      })}
    </span>
  }
}