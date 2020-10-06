import { Action } from "./action";
import { GameState } from "../../shared/model/v1/state";
import produce from "immer"

export function updateScoring(palyerId: string, influence: number, timestamp: number): Action {
  return {
    describe: () => `UpdateScoring ${JSON.stringify({ palyerId, influence, timestamp })}`,
    apply: (state: GameState) => {
      return produce(state, (draft) => {

        const scoring = draft.players[palyerId];
        const newScore = scoring.score + scoring.influence * (timestamp - scoring.lastScoringTimestamp);

        draft.players[palyerId].score = newScore;
        draft.players[palyerId].influence = influence;
        draft.players[palyerId].lastScoringTimestamp = timestamp;
        return draft;
      })
    }
  }
}