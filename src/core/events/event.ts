import { State } from "../state";
import { Action } from "../actions/action";

export interface GameEvent {
    timestamp: number,
    happen(): Action[]
}