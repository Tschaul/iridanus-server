import { State } from "../state";

export interface Action {
    apply(state: State): State
}