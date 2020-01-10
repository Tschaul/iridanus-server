import { GameState } from "../../shared/model/v1/state";
import { Action } from "../actions/action";
import { Observable } from "rxjs";

export interface GameEvent {
    timestamp: number,
    happen(): Action[]
}

export interface GameEventQueue {
    upcomingEvent$: Observable<GameEvent | null>
}