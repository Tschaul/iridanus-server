import { computed, observable } from "mobx";
import { GameData } from "./game-data";
import { InfoPanelViewModel } from "./info-panel-view-model";


export interface ScoringDisplay {
  currentScore: number,
  scoreDeltaPerWeek: number,
  id: string,
  color: string,
  finalScore: number,
}

export class ScoringsViewModel {
  constructor(
    private infoPanelViewModel: InfoPanelViewModel,
    private gameData: GameData
  ) {

    setInterval(() => {
      this.timestamp = new Date().getTime();
    }, 5 * 1000)
  }

  @observable public timestamp = new Date().getTime();

  @computed get gameEndTimestamp() {
    return this.gameData.gameEndTimestamp
  }

  @computed get gameEndScoreDisplay() {
    const gameEndingScore = this.gameData.gameRules.scoring.gameEndingScore;
    const week = 7 * this.infoPanelViewModel.millisecondsPerDay;
    return Math.round(gameEndingScore / week);
  }

  @computed public get scoringsDisplay() {

    const gameEndingScore = this.gameData.gameRules.scoring.gameEndingScore;
    const week = 7 * this.infoPanelViewModel.millisecondsPerDay;

    const result: ScoringDisplay[] = [];

    Object.values(this.gameData.scorings).forEach(scoring => {
      const playerInfo = this.gameData.playerInfos[scoring.playerId];
      const currentScore = scoring.score + (this.timestamp - scoring.lastScoringTimestamp) * scoring.influence;
      result.push({
        color: playerInfo.color,
        id: scoring.playerId,
        currentScore: Math.round(currentScore / week),
        scoreDeltaPerWeek: scoring.influence,
        finalScore: Math.round(gameEndingScore / week)
      })
    })

    return result;
  }
}