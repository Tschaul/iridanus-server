import { State } from "../state";

export interface Action {
    describe(): string;
    apply(state: State): State
}