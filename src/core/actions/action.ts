import { GameState } from "../../shared/model/v1/state";

export interface Action {
    describe(): string;
    apply(state: GameState): GameState
}