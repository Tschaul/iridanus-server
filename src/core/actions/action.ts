import { GameState } from "../state";

export interface Action {
    describe(): string;
    apply(state: GameState): GameState
}