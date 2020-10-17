import { computed, observable } from "mobx";
import { GameData } from "./game-data";
import { InfoPanelViewModel } from "./info-panel-view-model";


export interface ScoringDisplay {
  currentScore: number,
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
    return gameEndingScore;
  }

  @computed public get scoringsDisplay() {

    const gameEndingScore = this.gameData.gameRules.scoring.gameEndingScore;

    const result: ScoringDisplay[] = [];

    Object.getOwnPropertyNames(this.gameData.scorings).forEach(playerId => {
      const score = this.gameData.scorings[playerId];
      const playerInfo = this.gameData.playerInfos[playerId];
      result.push({
        color: playerInfo.color,
        id: playerId,
        currentScore: score,
        finalScore: gameEndingScore
      })
    })

    return result;
  }
}