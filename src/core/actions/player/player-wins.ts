import produce from "immer"
import { GameState } from "../../../shared/model/v1/state";
import { Action } from "../action";

export function playerWins(winningPlayerId: string): Action {
  return {
    describe: () => `PlayerWins ${JSON.stringify({winningPlayerId})}`,
    apply: (state: GameState) => {
      return produce(state, draft => {
        Object.getOwnPropertyNames(draft.players).forEach(playerId => {
          if (draft.players[playerId].status === 'PLAYING') {
            draft.players[playerId].status = playerId === winningPlayerId ? 'VICTORIOUS' : 'DEFEATED'
          }
        })
      })
    }
  }
}