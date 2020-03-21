import { Action } from "./action";
import { GameState } from "../../shared/model/v1/state";
import produce from "immer"

export function updateScoring(palyerId: string, influence: number, timestamp: number): Action {
  return {
    describe: () => `UpdateScoring ${JSON.stringify({ palyerId, influence, timestamp })}`,
    apply: (state: GameState) => {
      return produce(state, (draft) => {

        const scoring = draft.scorings[palyerId];
        const newScore = scoring.score + scoring.influence * (timestamp - scoring.lastScoringTimestamp);

        draft.scorings[palyerId].score = newScore;
        draft.scorings[palyerId].influence = influence;
        draft.scorings[palyerId].lastScoringTimestamp = timestamp;
        return draft;
      })
    }
  }
}