import { computed, observable } from "mobx";
import { GameData } from "./game-data";

const gameEndingScore = 7000 * 5 * 1000;
const week = 7 * 5 * 1000;

export interface ScoringDisplay {
  currentScore: number,
  scoreDeltaPerWeek: number,
  id: string,
  color: string,
  finalScore: number,
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
      const currentScore = scoring.score + (this.timestamp - scoring.lastScoringTimestamp) * scoring.influence;
      result.push({
        color: playerInfo.color,
        id: scoring.playerId,
        currentScore: Math.round(currentScore / week),
        scoreDeltaPerWeek: Math.round((10 * 5 * scoring.influence) / week) / 10,
        finalScore: Math.round(gameEndingScore / week)
      })
    })

    return result;
  }
}