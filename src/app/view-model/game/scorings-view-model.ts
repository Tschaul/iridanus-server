import { computed, observable } from "mobx";
import { GameData } from "./game-data";

const gameEndingScore = 3400 * 5 * 1000;

export interface ScoringDisplay {
  currentScore: number,
  scoreDeltaPerWeek: number,
  id: string,
  color: string
}

export class ScoringsViewModel {
  constructor(
    private gameData: GameData
  ) {

    setInterval(() => {
      this.timestamp = new Date().getTime();
    }, 5 * 1000)
  }

  @observable public timestamp = new Date().getTime();

  @computed public get scoringsDisplay() {

    const result: ScoringDisplay[] = [];

    Object.values(this.gameData.scorings).forEach(scoring => {
      const playerInfo = this.gameData.playerInfos[scoring.playerId];
      const currentScore = scoring.score + (this.timestamp -  scoring.lastScoringTimestamp) * scoring.influence;
      result.push({
        color: playerInfo.color,
        id: scoring.playerId,
        currentScore: Math.round(100 * currentScore / gameEndingScore),
        scoreDeltaPerWeek: Math.round(1000 * (1000 * 5 * scoring.influence) / gameEndingScore)  / 10
      })
    })

    return result;
  }
}